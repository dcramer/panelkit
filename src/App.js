import React, { Component } from "react";
import PropTypes from "prop-types";
import { Grid, Cell } from "styled-css-grid";

import HomeAssistant from "./hass";
import CameraWidget from "./components/CameraWidget";

export default class App extends Component {
  static propTypes = {
    host: PropTypes.string,
    accessToken: PropTypes.string,
  };

  static defaultProps = {
    host: process.env.REACT_APP_HASS_HOST || "localhost:8123",
    accessToken: process.env.REACT_APP_HASS_ACCESS_TOKEN,
  };

  constructor(props) {
    super(props);

    this.hass = new HomeAssistant({
      host: this.props.host,
      accessToken: this.props.accessToken,
      onConnectionChange: this.onConnectionChange,
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

  onConnectionChange = (hass, { state, phase }) => {
    this.setState({ isReady: hass.isReady(), state, phase });
  };

  render() {
    const hass = this.hass;
    if (!this.state.isReady) {
      return <div>Connecting to Home Assistant...</div>;
    }
    return (
      <Grid columns={12}>
        <Cell width={1}>1/12</Cell>
        <Cell width={1}>2/12</Cell>
        <Cell width={2}>1/6</Cell>
        <Cell width={2}>
          <CameraWidget hass={hass} entityId="camera.garage" />
        </Cell>
      </Grid>
    );
  }
}
