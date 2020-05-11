import React, { Component } from "react";
import PropTypes from "prop-types";
import { Grid, Cell } from "styled-css-grid";

import HomeAssistant from "./hass";
import CameraWidget from "./components/widgets/CameraWidget";
import LightWidget from "./components/widgets/LightWidget";

export default class App extends Component {
  static propTypes = {
    url: PropTypes.string,
    accessToken: PropTypes.string,
  };

  static defaultProps = {
    url: process.env.REACT_APP_HASS_URL || "http://localhost:8123",
    accessToken: process.env.REACT_APP_HASS_ACCESS_TOKEN,
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

  render() {
    const hass = this.hass;
    if (!this.state.isReady) {
      return <div>Connecting to Home Assistant...</div>;
    }
    return (
      <Grid columns="repeat(auto-fit,minmax(120px,1fr))">
        <Cell width={1}>
          <LightWidget
            hass={hass}
            entityId="light.guest_bedroom_office_room_wall_cans"
            name="Custom Light Name"
          />
        </Cell>
        <Cell width={1}>
          <LightWidget
            hass={hass}
            entityId="light.guest_bedroom_office_room_wall_cans"
          />
        </Cell>
        <Cell width={2}>1/6</Cell>
        <Cell width={2}>
          <CameraWidget hass={hass} entityId="camera.garage" />
        </Cell>
      </Grid>
    );
  }
}
