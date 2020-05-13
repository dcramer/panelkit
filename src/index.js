import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import * as serviceWorker from "./serviceWorker";
import WebFont from "webfontloader";
import Modal from "react-modal";

import "./index.css";

import { loadIcons } from "./components/Icon";
import { TILE } from "./tiles";
// TODO(dcramer): how do we define icons without importing things?

WebFont.load({
  google: {
    families: ["Rubik:300,400,500"],
  },
});

Modal.setAppElement("#root");

const initApp = () => {
  ReactDOM.render(
    <React.StrictMode>
      <App config={window.CONFIG} />
    </React.StrictMode>,
    document.getElementById("root")
  );

  // If you want your app to work offline and load faster, you can change
  // unregister() to register() below. Note this comes with some pitfalls.
  // Learn more about service workers: https://bit.ly/CRA-PWA
  serviceWorker.unregister();
};

const bootApp = () => {
  window.TILE = TILE;

  loadIcons(window.ICONS);

  const script = document.createElement("script");
  script.type = "text/javascript";
  script.async = true;
  script.onload = initApp;
  script.src = process.env.PUBLIC_URL + "/config.js";
  document.getElementsByTagName("head")[0].appendChild(script);
};

bootApp();
