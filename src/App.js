import React, { Component } from "react";
import PropTypes from "prop-types";
import { Grid, Cell } from "styled-css-grid";

import { mdiPiHole, mdiLightbulbGroupOff } from "@mdi/js";

import HomeAssistant from "./hass";

import Header from "./components/Header";

// import AlarmWidget from "./components/widgets/AlarmWidget";
// import CameraWidget from "./components/widgets/CameraWidget";
// import DoorControlWidget from "./components/widgets/DoorControlWidget";
// import LightWidget from "./components/widgets/LightWidget";
// import SwitchWidget from "./components/widgets/SwitchWidget";

const config = {
  tiles: [
    {
      width: 2,
      tiles: [
        {
          type: "DoorControlWidget",
        },
        {
          type: "AlarmWidget",
          entityId: "alarm_control_panel.home",
        },
        {
          type: "SwitchWidget",
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
          type: "SceneWidget",
          entityId: "scene.lights_off",
          name: "Turn Off Lights",
          icon: mdiLightbulbGroupOff,
        },
        {
          type: "LightWidget",
          entityId: "light.master_bedroom_lights",
          name: "Master Bd",
        },
        {
          type: "LightWidget",
          entityId: "light.guest_bedroom_lights",
          name: "Guest Bd",
        },
        {
          type: "LightWidget",
          entityId: "light.hallway_lights",
          name: "Hallway",
        },
        {
          type: "LightWidget",
          entityId: "light.office_lights",
          name: "Office",
        },
        {
          type: "LightWidget",
          entityId: "light.dining_room_lights",
          name: "Dining",
        },
        {
          type: "LightWidget",
          entityId: "light.kitchen_lights",
          name: "Kitchen",
        },
        {
          type: "LightWidget",
          entityId: "light.entryway_lights",
          name: "Entryway",
        },
        {
          type: "LightWidget",
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
          type: "CameraWidget",
          entityId: "camera.front_door_exterior",
        },
        {
          width: 4,
          type: "CameraWidget",
          entityId: "camera.garage_exterior",
        },
        {
          width: 4,
          type: "CameraWidget",
          entityId: "camera.garage",
        },
        {
          width: 4,
          type: "CameraWidget",
          entityId: "camera.backyard",
        },
      ],
    },
  ],
};

export default class App extends Component {
  static propTypes = {
    url: PropTypes.string,
    accessToken: PropTypes.string,
    config: PropTypes.object.isRequired,
    gridWidth: PropTypes.number.isRequired,
  };

  static defaultProps = {
    url: process.env.REACT_APP_HASS_URL || "http://localhost:8123",
    accessToken: process.env.REACT_APP_HASS_ACCESS_TOKEN,
    config,
    gridWidth: 8,
  };

  constructor(props) {
    super(props);

    this.hass = new HomeAssistant({
      url: this.props.url,
      accessToken: this.props.accessToken,
      onReady: this.onReady,
    });

    this.state = {
      state: null,
      phase: null,
      isReady: false,
    };
  }

  componentDidMount() {
    this.hass.connect();
  }

  componentWillUnmount() {
    this.hass.disconnect();
    delete this.hass;
  }

  onReady = () => {
    this.setState({ isReady: true });
  };

  // TODO: should cache this somewhere
  getCameraList() {
    const results = [];
    function recurse(tiles) {
      tiles.forEach((tile) => {
        if (tile.tiles) recurse(tile.tiles);
        else if (tile.entityId && tile.entityId.indexOf("camera.") === 0)
          results.push(tile.entityId);
      });
    }
    recurse(this.props.config.tiles);
    return results;
  }

  renderTiles(tiles, colWidth) {
    const hass = this.hass;
    const cameraList = this.getCameraList();
    return (
      <Grid columns={colWidth}>
        {tiles.map((tile, index) => {
          const widgetName = tile.type;
          let WidgetComponent;
          if (tile.tiles) {
            return (
              <Cell
                key={index}
                width={tile.width || 1}
                height={tile.height || 1}
              >
                {this.renderTiles(tile.tiles, tile.width || 1)}
              </Cell>
            );
          } else if (widgetName.indexOf("/") !== -1) {
            WidgetComponent = require(widgetName).default;
          } else {
            WidgetComponent = require(`./components/widgets/${widgetName}`)
              .default;
          }
          return (
            <Cell key={index} width={tile.width || 1}>
              <WidgetComponent hass={hass} {...tile} cameraList={cameraList} />
            </Cell>
          );
        })}
      </Grid>
    );
  }
  render() {
    if (!this.state.isReady) {
      return <div>Connecting to Home Assistant...</div>;
    }
    return (
      <div>
        <Header />
        {this.renderTiles(config.tiles, this.props.gridWidth)}
      </div>
    );
  }
}
