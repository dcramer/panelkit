import { createSlice } from "@reduxjs/toolkit";

export const hassAuthenticated = () => ({
  type: "HASS_AUTHENTICATED",
  phase: HassPhase.COMMAND,
});
export const hassConnect = (host) => ({
  type: "HASS_CONNECT",
  host,
  state: HassState.CONNECTING,
  phase: HassPhase.AUTHENTICATION,
});
export const hassConnected = () => ({
  type: "HASS_CONNECTED",
  state: HassState.CONNECTED,
});
export const hassDisconnect = () => ({ type: "HASS_DISCONNECT" });
export const hassDisconnected = () => ({
  type: "HASS_DISCONNECTED",
  state: HassState.DISCONNECTED,
});
export const hassError = () => ({ type: "HASS_ERROR" });
export const hassInit = (host, accessToken) => ({
  type: "HASS_INIT",
  host,
  accessToken,
});

export const HassState = {
  DISCONNECTED: "DISCONNECTED",
  CONNECTED: "CONNECTED",
  CONNECTING: "CONNECTING",
};

export const HassPhase = {
  AUTHENTICATION: "AUTHENTICATION",
  COMMAND: "COMMAND",
};

export const hassSlice = createSlice({
  name: "hass",
  initialState: {
    state: HassState.DISCONNECTED,
    phase: HassPhase.AUTHENTICATION,
  },
  reducers: {
    // increment: (state) => {
    //   // Redux Toolkit allows us to write "mutating" logic in reducers. It
    //   // doesn't actually mutate the state because it uses the Immer library,
    //   // which detects changes to a "draft state" and produces a brand new
    //   // immutable state based off those changes
    //   state.value += 1;
    // },
    // decrement: (state) => {
    //   state.value -= 1;
    // },
    // incrementByAmount: (state, action) => {
    //   state.value += action.payload;
    // },
  },
});

export const hassReducer = hassSlice.reducer;

// export const { increment, decrement, incrementByAmount } = counterSlice.actions;

export const hassMiddleware = () => {
  let socket = null;
  let timeout = 250;
  let connectInterval;

  let shouldReconnect = true;

  // options
  let host;
  let accessToken;

  const onOpen = (store) => (event) => {
    console.log("[hass] Connection opened", event.target.url);
    store.dispatch(hassConnected(event.target.url));
  };

  const onClose = (store) => (event) => {
    if (shouldReconnect) {
      timeout = Math.min(timeout + timeout, 10000); // increment retry interval

      console.log(
        `[hass] Socket is closed. Reconnect will be attempted in ${Math.min(
          10000 / 1000,
          timeout / 1000
        )} second(s).`,
        event.reason
      );

      // call check function after timeout
      connectInterval = setTimeout(() => check(store), timeout);
    }
    store.dispatch(hassDisconnected());
  };

  const onMessage = (store) => (event) => {
    const payload = JSON.parse(event.data);
    console.log("[hass] Received message of type", payload.type);

    switch (payload.type) {
      case "auth_required":
        if (accessToken) {
          console.log(accessToken);
          sendMessage({
            type: "auth",
            access_token: accessToken,
          });
        } else {
          console.error("[hass] No authentication token configured");
          store.dispatch(hassDisconnect());
        }
        break;
      case "auth_invalid":
        console.error("[hass] Invalid authentication token");
        store.dispatch(hassDisconnect());
        break;
      case "auth_ok":
        console.log("[hass] Authenticated successfully");
        store.dispatch(hassAuthenticated());
        break;
      default:
        break;
    }
  };

  const onError = (store) => (event) => {
    console.error("[hass] Socket encountered error. Closing socket");
    socket.close();
    socket = null;
    store.dispatch(hassError());
  };

  /**
   * utilited by the @function connect to check if the connection is close, if so attempts to reconnect
   */
  const check = (store) => {
    if (!socket || socket.readyState === WebSocket.CLOSED) connect(store); //check if websocket instance is closed, if so call `connect` function.
  };

  const init = (store, options) => {
    host = options.host;
    if (!host) throw new Error(`Invalid host: ${host}`);
    accessToken = options.accessToken;
    connect(store);
  };

  const connect = (store) => {
    if (socket !== null) {
      socket.close();
    }

    // reset timer to 250ms on open of websocket connection
    if (store.getState().hass.state === HassState.CONNECTED) {
      timeout = 250;
    }

    // clear Interval on on open of websocket connection
    if (connectInterval) clearTimeout(connectInterval);

    // connect to the remote host
    socket = new WebSocket(`ws://${host}/api/websocket`);

    // websocket handlers
    socket.onmessage = onMessage(store);
    socket.onclose = onClose(store);
    socket.onopen = onOpen(store);
    socket.onerror = onError(store);
  };

  const disconnect = () => {
    if (socket !== null) {
      socket.close();
    }
    socket = null;
    console.log("[hass] Disconnected");
  };

  const sendMessage = (message) => {
    console.log("[hass] Sending message of type", message.type);
    socket.send(JSON.stringify(message));
  };

  // the middleware part of this function
  return (store) => (next) => (action) => {
    switch (action.type) {
      case "HASS_INIT":
        init(store, {
          host: action.host,
          accessToken: action.accessToken,
        });
        break;
      case "HASS_CONNECT":
        connect(store);
        break;
      case "HASS_DISCONNECT":
        shouldReconnect = false;
        disconnect();
        break;
      case "NEW_MESSAGE":
        sendMessage(action.msg);
        break;
      default:
        return next(action);
    }
  };
};

export default hassMiddleware();
