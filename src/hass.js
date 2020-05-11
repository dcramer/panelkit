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

export default class HomeAssistant {
  constructor({ host, accessToken, onConnectionChange = null }) {
    this._socket = null;
    this._timeout = 250;
    this._connectTimer = null;
    this._messageCounter = 0;

    this._shouldReconnect = true;

    this._pendingRequests = {
      // requestId: Promise
    };

    this.state = State.DISCONNECTED;
    this.phase = Phase.AUTHENTICATION;

    // options
    this.host = host;
    this.accessToken = accessToken;
    this.onConnectionChange = onConnectionChange;
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
    console.log(
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
        break;
      default:
        if (payload.id !== undefined) {
          let promiseHandler = this._pendingRequests[payload.id];
          if (!promiseHandler) {
            console.warn(
              "[hass] No pending request found for event",
              payload.id,
              "of type",
              payload.type
            );
          } else {
            let [resolve, reject] = promiseHandler;
            delete this._pendingRequests[payload.id];
            if (payload.success) {
              resolve(payload.result);
            } else {
              reject(payload.error);
            }
          }
        }
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

  isReady() {
    return this.state === State.CONNECTED && this.phase === Phase.COMMAND;
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
}
