import React, { Component } from "react";
import PropTypes from "prop-types";
import { Flex, Box } from "reflexbox/styled-components";

import { mdiPiHole } from "@mdi/js";

import HomeAssistant from "./hass";

import Header from "./components/Header";

import AlarmWidget from "./components/widgets/AlarmWidget";
import CameraWidget from "./components/widgets/CameraWidget";
import DoorControlWidget from "./components/widgets/DoorControlWidget";
import LightWidget from "./components/widgets/LightWidget";
import SwitchWidget from "./components/widgets/SwitchWidget";

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
      <div>
        <Header />
        <Flex>
          <Box width={2 / 8} p={3}>
            <Flex>
              <Box width={1 / 2} p={1}>
                <DoorControlWidget hass={hass} name="Front Door" />
              </Box>
              <Box width={1 / 2} p={1}>
                <AlarmWidget hass={hass} entityId="alarm_control_panel.home" />
              </Box>
            </Flex>
            <Flex>
              <Box width={1 / 2} p={1}>
                <SwitchWidget
                  hass={hass}
                  entityId="switch.pi_hole"
                  icon={mdiPiHole}
                />
              </Box>
            </Flex>
          </Box>
          <Box width={2 / 8} p={3}>
            <Flex p={1}>
              <Box width={1}>
                <LightWidget
                  hass={hass}
                  entityId="light.guest_bedroom_office_room_wall_cans"
                  name="Multi Light Widget"
                />
              </Box>
            </Flex>
            <Flex>
              <Box width={1 / 2} p={1}>
                <LightWidget
                  hass={hass}
                  entityId="light.guest_bedroom_office_room_wall_cans"
                  name="Custom"
                />
              </Box>
              <Box width={1 / 2} p={1}>
                <LightWidget
                  hass={hass}
                  entityId="light.guest_bedroom_office_room_wall_cans"
                />
              </Box>
            </Flex>
          </Box>
          <Box width={4 / 8} p={3}>
            <Flex>
              <Box width={1} p={1}>
                <CameraWidget
                  hass={hass}
                  entityId="camera.front_door_exterior"
                />
              </Box>
            </Flex>
            <Flex>
              <Box width={1} p={1}>
                <CameraWidget hass={hass} entityId="camera.garage_exterior" />
              </Box>
            </Flex>
            <Flex>
              <Box width={1} p={1}>
                <CameraWidget hass={hass} entityId="camera.garage" />
              </Box>
            </Flex>
            <Flex>
              <Box width={1} p={1}>
                <CameraWidget hass={hass} entityId="camera.backyard" />
              </Box>
            </Flex>
          </Box>
        </Flex>
      </div>
    );
  }
}
