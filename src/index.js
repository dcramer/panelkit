import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import * as serviceWorker from "./serviceWorker";
import WebFont from "webfontloader";
import Modal from "react-modal";

import "./index.css";

import { TILE } from "./components/tiles";
// TODO(dcramer): how do we define icons without importing things?
import { mdiPiHole, mdiLightbulbGroupOff } from "@mdi/js";

const config = {
  tiles: [
    {
      width: 2,
      tiles: [
        {
          type: TILE.DOOR_CONTROL,
          camera: "camera.front_door_exterior",
          name: "Front Door",
        },
        {
          type: TILE.ALARM,
          entityId: "alarm_control_panel.home",
        },
        {
          type: TILE.SWITCH,
          entityId: "switch.pi_hole",
          icon: mdiPiHole,
        },
      ],
    },
    {
      width: 2,
      tiles: [
        {
          width: 2,
          type: TILE.SCENE,
          entityId: "scene.lights_off",
          name: "Turn Off Lights",
          icon: mdiLightbulbGroupOff,
        },
        {
          type: TILE.LIGHT,
          entityId: "light.master_bedroom_lights",
          name: "Master Bd",
        },
        {
          type: TILE.LIGHT,
          entityId: "light.guest_bedroom_lights",
          name: "Guest Bd",
        },
        {
          type: TILE.LIGHT,
          entityId: "light.hallway_lights",
          name: "Hallway",
        },
        {
          type: TILE.LIGHT,
          entityId: "light.office_lights",
          name: "Office",
        },
        {
          type: TILE.LIGHT,
          entityId: "light.dining_room_lights",
          name: "Dining",
        },
        {
          type: TILE.LIGHT,
          entityId: "light.kitchen_lights",
          name: "Kitchen",
        },
        {
          type: TILE.LIGHT,
          entityId: "light.entryway_lights",
          name: "Entryway",
        },
        {
          type: TILE.LIGHT,
          entityId: "light.front_door_lights",
          name: "Front Door",
        },
      ],
    },
    {
      width: 4,
      tiles: [
        {
          width: 4,
          type: TILE.CAMERA,
          entityId: "camera.front_door_exterior",
        },
        {
          width: 4,
          type: TILE.CAMERA,
          entityId: "camera.garage_exterior",
        },
        {
          width: 4,
          type: TILE.CAMERA,
          entityId: "camera.garage",
        },
        {
          width: 4,
          type: TILE.CAMERA,
          entityId: "camera.backyard",
        },
      ],
    },
  ],
};

WebFont.load({
  google: {
    families: ["Rubik:300,500"],
  },
});

Modal.setAppElement("#root");

ReactDOM.render(
  <React.StrictMode>
    <App config={config} />
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
