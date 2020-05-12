import React, { Component } from "react";
import PropTypes from "prop-types";
import { Grid, Cell } from "styled-css-grid";
import styled from "styled-components";

import { mdiPiHole, mdiLightbulbGroupOff } from "@mdi/js";

import HomeAssistant from "./hass";

import Header from "./components/Header";
import { TILE } from "./components/tiles";

const config = {
  tiles: [
    {
      width: 2,
      tiles: [
        {
          type: TILE.DOOR_CONTROL,
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

const Container = styled.div`
  padding: 20px;
`;

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
          } else {
            return (
              <Cell key={index} width={tile.width || 1}>
                <tile.type hass={hass} {...tile} cameraList={cameraList} />
              </Cell>
            );
          }
        })}
      </Grid>
    );
  }
  render() {
    if (!this.state.isReady) {
      return <div>Connecting to Home Assistant...</div>;
    }
    return (
      <Container>
        <Header />
        {this.renderTiles(config.tiles, this.props.gridWidth)}
      </Container>
    );
  }
}
