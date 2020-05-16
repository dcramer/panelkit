import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import * as serviceWorker from "./serviceWorker";
import WebFont from "webfontloader";

import "./index.css";

import { ModalProvider } from "./components/Modal";
import { loadIcons } from "./components/Icon";
import { TILE } from "./tiles";

import { Config } from "./types";

declare global {
  interface Window {
    CONFIG: Config;
    CONFIG_FILE: string;
    TILE: React.ReactNode;
    ICONS: Map<string, string>;
  }
}

window.CONFIG = window.CONFIG || { tiles: [] };

WebFont.load({
  google: {
    families: ["Rubik:300,400,500"],
  },
});

const initApp = (configError: ErrorEvent | null = null) => {
  ReactDOM.render(
    <React.StrictMode>
      <ModalProvider>
        <App config={window.CONFIG} configError={configError} />
      </ModalProvider>
    </React.StrictMode>,
    document.getElementById("root")
  );

  // If you want your app to work offline and load faster, you can change
  // unregister() to register() below. Note this comes with some pitfalls.
  // Learn more about service workers: https://bit.ly/CRA-PWA
  serviceWorker.unregister();
};

const bootApp = () => {
  let configError: ErrorEvent | null = null;
  const configFile =
    window.CONFIG_FILE || process.env.PUBLIC_URL + "/config.js";

  window.TILE = TILE;
  window.React = React;

  loadIcons(window.ICONS);

  const handleParseError = (err: ErrorEvent) => {
    if (err.filename && err.filename.indexOf(configFile) !== -1) {
      configError = err;
      console.error("[panelkit] Unable to load configuration", err);
    }
  };

  console.log(`[panelkit] Loading config from ${configFile}`);

  const script = document.createElement("script");
  script.type = "text/javascript";
  script.async = true;
  script.onload = () => {
    window.removeEventListener("error", handleParseError);
    initApp(configError);
  };
  script.onerror = () => {
    console.error("couldnt load script");
  };
  script.src = configFile;
  window.addEventListener("error", handleParseError);
  document.getElementsByTagName("head")[0].appendChild(script);
};

bootApp();
