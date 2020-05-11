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

export default class HomeAssistant {
  constructor({
    host,
    accessToken,
    onConnectionChange = null,
    onReady = null,
  }) {
    this._socket = null;
    this._timeout = 250;
    this._connectTimer = null;
    this._messageCounter = 0;

    this._hasPrepared = false;
    this._shouldReconnect = true;

    this._pendingRequests = {
      // requestId: Promise
    };
    this._eventSubscribers = [
      // {id, entityId, callback(entityId, oldState, newState)}
    ];
    this._rootSubscriptions = {
      // ID: eventType
    };
    this._stateCache = {};

    this.state = State.DISCONNECTED;
    this.phase = Phase.AUTHENTICATION;

    // options
    this.host = host;
    this.accessToken = accessToken;
    this.onConnectionChange = onConnectionChange || function () {};
    this.onReady = onReady || function () {};
  }

  _onOpen = (event) => {
    console.log("[hass] Connection opened", event.target.url);
    this.state = State.CONNECTED;
    this.phase = Phase.AUTHENTICATION;
    this.onConnectionChange(this, {
      state: this.state,
      phase: this.phase,
    });
  };

  _onClose = (event) => {
    this.state = State.DISCONNECTED;
    this.phase = Phase.AUTHENTICATION;
    this.onConnectionChange(this, {
      state: this.state,
      phase: this.phase,
    });
    if (this._shouldReconnect) {
      // increment retry interval - max of 10s
      this._timeout = Math.min(this._timeout + this._timeout, 10000);

      console.log(
        `[hass] Socket is closed. Reconnect will be attempted in ${
          this._timeout / 1000
        } second(s).`,
        event.reason
      );

      // call check function after timeout
      this._connectTimer = setTimeout(this.checkConnection, this._timeout);
    }
  };

  _onMessage = (event) => {
    const payload = JSON.parse(event.data);
    console.debug(
      "[hass] Received message of type",
      payload.type,
      "and id",
      payload.id >= 0 ? payload.id : "null"
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
        this.onConnectionChange(this, {
          state: this.state,
          phase: this.phase,
        });
        this._prepareApp();
        break;
      case "event":
        const { entity_id, new_state, old_state } = payload.event.data;
        this._eventSubscribers.forEach(({ entityId, callback }) => {
          if (entity_id === entityId) {
            callback(entity_id, new_state, old_state);
          }
        });
        break;
      case "result":
        const promiseHandler = this._pendingRequests[payload.id];
        if (!promiseHandler) {
          console.warn("[hass] No pending request found for event", payload.id);
        } else {
          let [resolve, reject] = promiseHandler;
          delete this._pendingRequests[payload.id];
          if (payload.success) {
            resolve(payload);
          } else {
            reject(payload);
          }
        }
        break;
      default:
        break;
    }
  };

  _onError = (event) => {
    console.error("[hass] Socket encountered error. Closing socket");
    this._socket.close();
    this._socket = null;
    this.phase = Phase.AUTHENTICATION;
    this.state = State.DISCONNECTED;
    this.onConnectionChange(this, {
      state: this.state,
      phase: this.phase,
    });
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
    const _stateCache = this._stateCache;
    const subPromise = this.subscribeEvents("state_change");
    const { result } = await this.getStates();
    result.forEach((state) => {
      _stateCache[state.entity_id] = state;
    });

    await subPromise;
    this._hasPrepared = true;
    this.onReady(this);
  };

  isReady() {
    return (
      this._hasPrepared &&
      this.state === State.CONNECTED &&
      this.phase === Phase.COMMAND
    );
  }

  getState(entityId) {
    return this._stateCache[entityId];
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
    this._socket = new WebSocket(`ws://${this.host}/api/websocket`);

    // websocket handlers
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
    console.log(
      "[hass] Sending message of type",
      message.type,
      "and id",
      message.id >= 0 ? message.id : "null"
    );
    this._socket.send(JSON.stringify(message));
    this._messageCounter += 1;
  }

  sendCommand(message) {
    const id = this._messageCounter;
    const promise = new Promise((resolve, reject) => {
      this._pendingRequests[id] = [resolve, reject];
      this.sendMessage({
        id,
        ...message,
      });
    });
    promise.cancel = () => {
      delete this._pendingRequests[id];
    };
    return promise;
  }

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

  callService(domain, service, serviceData) {
    return this.sendCommand({
      type: "call_service",
      domain,
      service,
      service_data: serviceData,
    });
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

  // TODO(dcramer): if we're going to support subscriptions, we'll may want to bake in
  // a full event model to automatically handle subscribers/unsubscribers
  async subscribeEvents(eventType) {
    const response = await this.sendCommand({
      type: "subscribe_events",
      event_type: eventType,
    });
    this._rootSubscriptions[response.id] = eventType;
  }

  // unsubscribeEvents(subscription) {
  //   // subscription is the 'id'
  //   return this.sendCommand({
  //     type: "subscribe_events",
  //     subscription,
  //   });
  // }
}
