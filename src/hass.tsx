import { Entity } from "./types";

enum State {
  DISCONNECTED = "DISCONNECTED",
  CONNECTED = "CONNECTED",
  CONNECTING = "CONNECTING",
}

enum Phase {
  AUTHENTICATION = "AUTHENTICATION",
  COMMAND = "COMMAND",
}

const DEFAULT_TIMEOUT = 250; // ms

const makeSubscriberId = (): string => {
  const s4 = () => {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  };
  return `${s4()}${s4()}`;
};

type SubscriberCallback = (entityId: string, newState: Entity) => void;

interface EventSubscriber {
  id: string;
  entityId: string;
  callback: SubscriberCallback;
}

interface HomeAssistantOptions {
  url: string;
  accessToken: string;
  onReady?: (() => void) | null;
  onError?: ((error: Error | ErrorEvent) => void) | null;
  onOpen?: (() => void) | null;
}

type WebSocketOpenEventTarget = EventTarget & {
  url: string;
};

type WebSocketOpenEvent = Event & {
  target: WebSocketOpenEventTarget;
};

export interface Message {
  type: string;
  [key: string]: any;
}

export interface Command extends Message {
  id: number;
}

export interface MessageResult {
  result: any;
  error: {
    message: string;
  } | null;
  success: boolean;
  [key: string]: any;
}

export interface CommandResult extends MessageResult {
  id: number;
}

export interface SuggestedChanges {
  [entityId: string]: {
    state?: any;
    attributes?: {
      [key: string]: any;
    };
  };
}

// TODO(dcramer): move to home-assistant-js-websocket
export default class HomeAssistant {
  private _socket: WebSocket | null = null;
  private _timeout: number = 250;
  private _connectTimer: number | null;
  private _messageCounter: number = 1;
  private _hasPrepared: boolean = false;
  private _shouldReconnect: boolean = false;
  private _pendingRequests: Map<number, [Function, Function]>;
  private _pendingChanges: Map<number, SuggestedChanges>;
  private _eventSubscribers: EventSubscriber[];
  private _rootSubscriptions: Map<string, string>;
  private _entityCache: Map<string, any>;

  public state: State;
  public phase: Phase;

  public url: string;
  private accessToken: string;
  // TODO:
  private onReady?: any;
  private onError?: any;
  private onOpen?: any;
  // private onReady?: (() => void) | null = null;
  // private onError?: ((error: Error) => void) | null = null;
  // private onOpen?: (() => void) | null = null;

  constructor({
    url,
    accessToken,
    onReady = null,
    onError = null,
    onOpen = null,
  }: HomeAssistantOptions) {
    this._socket = null;
    this._timeout = 250;
    this._connectTimer = null;
    this._messageCounter = 1;

    this._hasPrepared = false;
    this._shouldReconnect = true;

    // requests which are in progress
    // requestId: Promise
    this._pendingRequests = new Map();
    // changes which are pending a response, but assumed to succeed
    // requestId: {entityId: {state: ..., attributes: {...}}}
    this._pendingChanges = new Map();
    this._eventSubscribers = [
      // {id, entityId, callback(entityId, newState)}
    ];
    // ID: eventType
    this._rootSubscriptions = new Map();
    this._entityCache = new Map();

    this.state = State.DISCONNECTED;
    this.phase = Phase.AUTHENTICATION;

    // options
    this.url = url;
    this.accessToken = accessToken;
    this.onReady = onReady || function () {};
    this.onError = onError || function () {};
    this.onOpen = onOpen || function () {};
  }

  private _onOpen = (ev: Event) => {
    console.log(
      "[hass] Connection opened",
      (ev as WebSocketOpenEvent).target.url
    );
    this.state = State.CONNECTED;
    this.phase = Phase.AUTHENTICATION;

    this.onOpen();
  };

  private _onError = (ev: Event) => {
    const error = new Error(
      "[hass] Error communicating with Home Assistant. Closing Socket"
    );
    if (this._socket) {
      this._socket.close();
      this._socket = null;
    }
    this.phase = Phase.AUTHENTICATION;
    this.state = State.DISCONNECTED;

    this.onError(error);
  };

  private _onClose = (ev: Event) => {
    const { code, reason } = ev as WebSocketCloseEvent;
    const willRetry = this._canRetryConnection(code);
    const error = new Error(
      `Error communicating with Home Assistant. Code ${code} - ${
        reason || "unknown error"
      }` +
        (willRetry
          ? ` Reconnect will be attempted in ${this._timeout / 1000} second(s).`
          : "")
    );
    this.state = State.DISCONNECTED;
    this.phase = Phase.AUTHENTICATION;
    if (willRetry) {
      // increment retry interval - max of 10s
      this._timeout = Math.min(this._timeout + this._timeout, 10000);
      // call check function after timeout
      this._connectTimer = setTimeout(this._checkConnection, this._timeout);
    }

    console.log(error.message, reason);
    this.onError(error);
  };

  _onMessage = (event: WebSocketMessageEvent) => {
    const payload: MessageResult | CommandResult = JSON.parse(event.data);
    console.debug(
      "[hass] Received message of type",
      payload.type,
      "and id",
      payload.id || "null"
    );

    switch (payload.type) {
      case "auth_required":
        if (this.accessToken) {
          this.sendMessage({
            type: "auth",
            access_token: this.accessToken,
          });
        } else {
          console.error("[hass] No authentication token configured");
          this.disconnect();
        }
        break;
      case "auth_invalid":
        console.error("[hass] Invalid authentication token");
        this.disconnect();
        break;
      case "auth_ok":
        console.log("[hass] Authenticated successfully");
        this.phase = Phase.COMMAND;
        this._prepareApp();
        break;
      case "event":
        const { entity_id, new_state } = payload.event.data;
        if (payload.event.event_type === "state_changed") {
          this._entityCache.set(entity_id, new_state);
        }
        this._notifySubscribers(entity_id, new_state);
        break;
      case "result":
        const promiseHandler = this._pendingRequests.get(payload.id);
        if (!promiseHandler) {
          console.warn("[hass] No pending request found for event", payload.id);
        } else {
          let [resolve, reject] = promiseHandler;
          this._pendingRequests.delete(payload.id);
          if (payload.success) {
            setTimeout(() => {
              this._pendingChanges.delete(payload.id);
            }, 1000);
            resolve(payload);
          } else if (payload.error) {
            const error = new Error(payload.error.message);
            (error as any).payload = payload;
            const changes = this._pendingChanges.get(payload.id);
            if (changes) {
              this._pendingChanges.set(payload.id, {});
              Object.keys(changes).forEach((entityId) => {
                this._notifySubscribers(entityId, this.getEntity(entityId));
              });
            }
            reject(error);
          }
        }
        break;
      default:
        break;
    }
  };

  /**
   * utilited by the @function connect to check if the connection is close, if so attempts to reconnect
   */
  private _checkConnection = () => {
    // check if websocket instance is closed, if so call `connect` function.
    if (!this._socket || this._socket.readyState === WebSocket.CLOSED) {
      this.connect();
    }
  };

  private _prepareApp = async () => {
    await this.subscribeEvents("state_changed");
    const { result } = await this.getStates();
    this.populateEntityCache(result);

    this._hasPrepared = true;
    this.onReady && this.onReady(this);
  };

  private _notifySubscribers(entityId: string, newState: Entity) {
    this._eventSubscribers.forEach((subscriber) => {
      if (subscriber.entityId === entityId) {
        subscriber.callback(entityId, newState);
      }
    });
  }

  populateEntityCache(entityList: Entity[]) {
    const _entityCache = this._entityCache;
    entityList.forEach((entity: Entity) => {
      _entityCache.set(entity.entity_id, entity);
    });
  }

  isReady(): boolean {
    return (
      this._hasPrepared &&
      this.state === State.CONNECTED &&
      this.phase === Phase.COMMAND
    );
  }

  buildUrl(path: string): string {
    return `${this.url}${path}`;
  }

  getEntity(entityId: string): Entity {
    const result: Entity = { ...this._entityCache.get(entityId) };
    if (!result)
      throw new Error(`Unable to find entity in state cache: ${entityId}`);

    Object.values(this._pendingChanges).forEach((data) => {
      Object.keys(data).forEach((eId) => {
        if (eId === entityId) {
          Object.keys(data[eId]).forEach((k) => {
            if (k === "state") result[k] = data[eId][k];
            else result[k] = { ...(result[k] || {}), ...data[eId][k] };
          });
        }
      });
    });

    return result;
  }

  getEntityName(entity: Entity): string {
    return entity.attributes.friendly_name || entity.entity_id || "";
  }

  getEntityPicture(entityId: string): string | null {
    const {
      attributes: { entity_picture },
    } = this.getEntity(entityId);
    if (entity_picture) return null;
    return this.buildUrl(entity_picture);
  }

  _canRetryConnection(code?: number): boolean {
    if (!this._shouldReconnect) return false;
    switch (code) {
      // case 1002:
      // case 1003:
      // case 1007:
      // case 1008:
      // case 1010:
      // case 1015:
      //   return false;
      default:
        return true;
    }
  }

  connect() {
    if (this._socket !== null) {
      this._socket.close();
    }

    // reset retry timer if previous connection was successful
    if (this.state === State.CONNECTED) {
      this._timeout = DEFAULT_TIMEOUT;
    }

    this.state = State.CONNECTING;
    this.phase = Phase.AUTHENTICATION;
    this._shouldReconnect = true;
    this._hasPrepared = false;

    // clear timer on open of websocket connection
    if (this._connectTimer) clearTimeout(this._connectTimer);

    // connect to the remote host
    this._socket = new WebSocket(
      `ws://${this.url.split("://", 2)[1]}/api/websocket`
    );

    this._socket.onmessage = this._onMessage;
    this._socket.onclose = this._onClose;
    this._socket.onopen = this._onOpen;
    this._socket.onerror = this._onError;
  }

  disconnect() {
    if (this._socket !== null) {
      this._socket.close();
    }
    this._socket = null;
    this._shouldReconnect = false;
    this.state = State.DISCONNECTED;
    console.log("[hass] Disconnected");
  }

  sendMessage(message: Message | Command) {
    console.debug(
      "[hass] Sending message of type",
      message.type,
      "and id",
      message.id || "null"
    );
    if (!this._socket)
      throw new Error("Connection to Home Assistant is not available.");
    this._socket.send(JSON.stringify(message));
    this._messageCounter += 1;
  }

  /*
   * Send a command to Home Assistant
   *
   * ```
   * sendCommand({type: "ping"}).then(response => console.log(response));
   * ```
   *
   * For optimistic entity updates, pass the suggestedChanges paramter:
   *
   * ```
   * sendCommand({type: "update_entity", "entityId": "foo.bar", "state": "on"}, {"foo.bar": {"state": "on"}})
   * ```
   */
  sendCommand(
    message: Message,
    suggestedChanges: SuggestedChanges | null = null
  ): any {
    const id = this._messageCounter;
    const promise = new Promise((resolve, reject) => {
      this._pendingRequests.set(id, [resolve, reject]);
      if (suggestedChanges) {
        this._pendingChanges.set(id, suggestedChanges);
        Object.keys(suggestedChanges).forEach((entityId) => {
          this._notifySubscribers(entityId, this.getEntity(entityId));
        });
      }
      this.sendMessage({
        id,
        ...message,
      } as Command);
    });
    (promise as any).cancel = () => {
      this._pendingRequests.delete(id);
      this._pendingChanges.delete(id);
    };
    return promise;
  }

  // TODO(dcramer): > The websocket command 'camera_thumbnail' has been deprecated.
  fetchCameraThumbnail(entityId: string) {
    return this.sendCommand({
      type: "camera_thumbnail",
      entity_id: entityId,
    });
  }

  fetchMediaPlayerThumbnail(entityId: string) {
    return this.sendCommand({
      type: "media_player_thumbnail",
      entity_id: entityId,
    });
  }

  callService(
    domain: string,
    service: string,
    serviceData: any,
    suggestedChanges: SuggestedChanges | null = null
  ) {
    return this.sendCommand(
      {
        type: "call_service",
        domain,
        service,
        service_data: serviceData,
      },
      suggestedChanges
    );
  }

  getStates() {
    return this.sendCommand({
      type: "get_states",
    });
  }

  subscribe(entityId: string, callback: SubscriberCallback) {
    const id = makeSubscriberId();
    this._eventSubscribers.push({
      entityId,
      callback,
      id,
    });
    return id;
  }

  unsubscribe(id: string) {
    this._eventSubscribers = this._eventSubscribers.filter((c) => c.id !== id);
  }

  async ping() {
    const response = await this.sendCommand({
      type: "ping",
    });
    if (response.type !== "pong")
      throw new Error("ping did not receive a pong response");
    return response;
  }

  async subscribeEvents(eventType: string) {
    const response = await this.sendCommand({
      type: "subscribe_events",
      event_type: eventType,
    });
    this._rootSubscriptions.set(response.id, eventType);
    return response;
  }

  unsubscribeEvents(subscription: number) {
    // subscription is the 'id'
    return this.sendCommand({
      type: "unsubscribe_events",
      subscription,
    });
  }
}
