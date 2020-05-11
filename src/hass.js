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
  constructor({ host, accessToken }) {
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
  }

  onOpen = (event) => {
    console.log("[hass] Connection opened", event.target.url);
    this.state = State.CONNECTED;
  };

  onClose = (event) => {
    if (this._shouldReconnect) {
      // increment retry interval
      this._timeout = Math.min(this._timeout + this._timeout, 10000);

      console.log(
        `[hass] Socket is closed. Reconnect will be attempted in ${
          this._timeout / 1000
        } second(s).`,
        event.reason
      );

      // call check function after timeout
      this._connectTimer = setTimeout(this.check, this._timeout);
    }
  };

  onMessage = (event) => {
    const payload = JSON.parse(event.data);
    console.log("[hass] Received message of type", payload.type);

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
        break;
      default:
        break;
    }
  };

  onError = (event) => {
    console.error("[hass] Socket encountered error. Closing socket");
    this._socket.close();
    this._socket = null;
    this.phase = Phase.AUTHENTICATION;
    this.state = State.DISCONNECTED;
  };

  /**
   * utilited by the @function connect to check if the connection is close, if so attempts to reconnect
   */
  check = () => {
    // check if websocket instance is closed, if so call `connect` function.
    if (!this._socket || this._socket.readyState === WebSocket.CLOSED) {
      this.connect();
    }
  };

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
    this._socket.onmessage = this.onMessage;
    this._socket.onclose = this.onClose;
    this._socket.onopen = this.onOpen;
    this._socket.onerror = this.onError;
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
    console.log("[hass] Sending message of type", message.type);
    this._socket.send(JSON.stringify(message));
  }

  sendCommand(message) {
    this._messageCounter += 1;
    this.sendMessage({
      id: this._messageCounter,
      ...message,
    });
  }
}
