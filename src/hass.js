export const State = Object.freeze({
  DISCONNECTED: "DISCONNECTED",
  CONNECTED: "CONNECTED",
  CONNECTING: "CONNECTING",
});

export const Phase = Object.freeze({
  AUTHENTICATION: "AUTHENTICATION",
  COMMAND: "COMMAND",
});

const DEFAULT_TIMEOUT = 250; // ms

const makeSubscribeId = () => {
  const s4 = () => {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  };
  return `${s4()}${s4()}`;
};

// TODO(dcramer): move to home-assistant-js-websocket
export default class HomeAssistant {
  constructor({
    url,
    accessToken,
    onReady = null,
    onError = null,
    onOpen = null,
  }) {
    this._socket = null;
    this._timeout = 250;
    this._connectTimer = null;
    this._messageCounter = 1;

    this._hasPrepared = false;
    this._shouldReconnect = true;

    // requests which are in progress
    this._pendingRequests = {
      // requestId: Promise
    };
    // changes which are pending a response, but assumed to succeed
    this._pendingChanges = {
      // requestId: {entityId: {state: ..., attributes: {...}}}
    };
    this._eventSubscribers = [
      // {id, entityId, callback(entityId, newState)}
    ];
    this._rootSubscriptions = {
      // ID: eventType
    };
    this._entityCache = {};

    this.state = State.DISCONNECTED;
    this.phase = Phase.AUTHENTICATION;

    // options
    this.url = url;
    this.accessToken = accessToken;
    this.onReady = onReady || function () {};
    this.onError = onError || function () {};
    this.onOpen = onOpen || function () {};
  }

  _onOpen = (event) => {
    console.log("[hass] Connection opened", event.target.url);
    this.state = State.CONNECTED;
    this.phase = Phase.AUTHENTICATION;

    this.onOpen();
  };

  _onError = (_event) => {
    const err = new Error(
      "[hass] Error communicating with Home Assistant. Closing Socket"
    );
    this._socket.close();
    this._socket = null;
    this.phase = Phase.AUTHENTICATION;
    this.state = State.DISCONNECTED;

    console.error(err);
    this.onError(err);
  };

  _onClose = (event) => {
    const willRetry = this._canRetryConnection(event.code);
    const err = new Error(
      `Error communicating with Home Assistant. Code ${event.code} - ${
        event.reason || "unknown error"
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
      this._connectTimer = setTimeout(this.checkConnection, this._timeout);
    }

    console.log(err.message, event.reason);
    this.onError(err);
  };

  _onMessage = (event) => {
    const payload = JSON.parse(event.data);
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
          this._entityCache[entity_id] = new_state;
        }
        this._notifySubscribers(entity_id, new_state);
        break;
      case "result":
        const promiseHandler = this._pendingRequests[payload.id];
        if (!promiseHandler) {
          console.warn("[hass] No pending request found for event", payload.id);
        } else {
          let [resolve, reject] = promiseHandler;
          delete this._pendingRequests[payload.id];
          if (payload.success) {
            setTimeout(() => {
              delete this._pendingChanges[payload.id];
            }, 1000);
            resolve(payload);
          } else {
            const err = new Error(payload.error.message);
            err.payload = payload;
            const changes = this._pendingChanges[payload.id];
            if (changes) {
              this._pendingChanges[payload.id] = {};
              Object.keys(changes).forEach((entityId) => {
                this._notifySubscribers(entityId, this.getEntity(entityId));
              });
            }
            reject(err);
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
  _checkConnection = () => {
    // check if websocket instance is closed, if so call `connect` function.
    if (!this._socket || this._socket.readyState === WebSocket.CLOSED) {
      this.connect();
    }
  };

  _prepareApp = async () => {
    await this.subscribeEvents("state_changed");
    const _entityCache = this._entityCache;
    const { result } = await this.getStates();
    result.forEach((state) => {
      _entityCache[state.entity_id] = state;
    });

    this._hasPrepared = true;
    this.onReady(this);
  };

  _notifySubscribers(entityId, ...params) {
    this._eventSubscribers.forEach((subscriber) => {
      if (subscriber.entityId === entityId) {
        subscriber.callback(entityId, ...params);
      }
    });
  }

  isReady() {
    return (
      this._hasPrepared &&
      this.state === State.CONNECTED &&
      this.phase === Phase.COMMAND
    );
  }

  buildUrl(path) {
    return `${this.url}${path}`;
  }

  getEntity(entityId) {
    const result = { ...this._entityCache[entityId] };
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

  getEntityName(entity) {
    return entity.attributes.friendly_name || entity.entity_id;
  }

  getEntityPicture(entityId) {
    const {
      attributes: { entity_picture },
    } = this.getEntity(entityId);
    return this.buildUrl(entity_picture);
  }

  _canRetryConnection(code) {
    if (!this._shouldReconnect) return false;
    switch (code) {
      case 1002:
      case 1003:
      case 1007:
      case 1008:
      case 1010:
      case 1015:
        return false;
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

  sendMessage(message) {
    console.debug(
      "[hass] Sending message of type",
      message.type,
      "and id",
      message.id || "null"
    );
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
  sendCommand(message, suggestedChanges = null) {
    const id = this._messageCounter;
    const promise = new Promise((resolve, reject) => {
      this._pendingRequests[id] = [resolve, reject];
      if (suggestedChanges) {
        this._pendingChanges[id] = suggestedChanges;
        Object.keys(suggestedChanges).forEach((entityId) => {
          this._notifySubscribers(entityId, this.getEntity(entityId));
        });
      }
      this.sendMessage({
        id,
        ...message,
      });
    });
    promise.cancel = () => {
      delete this._pendingRequests[id];
      delete this._pendingChanges[id];
    };
    return promise;
  }

  // TODO(dcramer): > The websocket command 'camera_thumbnail' has been deprecated.
  fetchCameraThumbnail(entityId) {
    return this.sendCommand({
      type: "camera_thumbnail",
      entity_id: entityId,
    });
  }

  fetchMediaPlayerThumbnail(entityId) {
    return this.sendCommand({
      type: "media_player_thumbnail",
      entity_id: entityId,
    });
  }

  callService(domain, service, serviceData, suggestedChanges = null) {
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

  subscribe(entityId, callback) {
    const id = makeSubscribeId();
    this._eventSubscribers.push({
      entityId,
      callback,
      id,
    });
    return id;
  }

  unsubscribe(id) {
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

  async subscribeEvents(eventType) {
    const response = await this.sendCommand({
      type: "subscribe_events",
      event_type: eventType,
    });
    this._rootSubscriptions[response.id] = eventType;
    return response;
  }

  unsubscribeEvents(subscription) {
    // subscription is the 'id'
    return this.sendCommand({
      type: "unsubscribe_events",
      subscription,
    });
  }
}
