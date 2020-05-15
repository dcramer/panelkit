import React, { Component } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { ToastContainer, toast } from "react-toastify";
import { Flex, Box } from "reflexbox/styled-components";

import "react-toastify/dist/ReactToastify.css";

import HomeAssistant from "./hass";
import Header from "./components/Header";
import { TileConfig } from "./tiles/Tile";

const Container = styled.div``;

export default class App extends Component {
  static propTypes = {
    config: PropTypes.shape({
      url: PropTypes.string,
      accessToken: PropTypes.string,
      tiles: PropTypes.arrayOf(
        PropTypes.shape({
          type: PropTypes.elementType,
          tiles: PropTypes.array,
          ...TileConfig,
        })
      ).isRequired,
    }).isRequired,
    gridWidth: PropTypes.number.isRequired,
  };

  static defaultProps = {
    gridWidth: 8,
  };

  constructor(props) {
    super(props);

    this.hass = new HomeAssistant({
      // we prioritize the environment variables to ease development
      url:
        process.env.REACT_APP_HASS_URL ||
        this.props.config.url ||
        "http://localhost:8123",
      accessToken:
        process.env.REACT_APP_HASS_ACCESS_TOKEN ||
        this.props.config.accessToken,
      onReady: this.onReady,
    });

    this.state = {
      state: null,
      phase: null,
      isReady: false,
    };
  }

  componentDidMount() {
    this.hass.connect().catch((err) => {
      toast.error(err.message);
    });
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

  renderTiles(tiles, colWidth, isChild = false) {
    const hass = this.hass;
    const cameraList = this.getCameraList();
    return (
      <Flex
        flexWrap="wrap"
        px={isChild ? "10px" : 0}
        alignContent="space-around"
      >
        {tiles.map((tile, index) => {
          if (tile.tiles) {
            return (
              <Box
                key={index}
                width={(tile.width || 1) / colWidth}
                height={140 * (tile.height || 1)}
                style={{ minWidth: 140 * tile.width }}
              >
                {this.renderTiles(tile.tiles, tile.width || 1, true)}
              </Box>
            );
          } else {
            return (
              <Box
                key={index}
                width={(tile.width || 1) / colWidth}
                p="4px"
                height={140 * (tile.height || 1)}
                style={{ minWidth: 140 * tile.width }}
              >
                <tile.type hass={hass} {...tile} cameraList={cameraList} />
              </Box>
            );
          }
        })}
      </Flex>
    );
  }

  renderContent() {
    return (
      <React.Fragment>
        <Header />
        {this.renderTiles(this.props.config.tiles, this.props.gridWidth)}
      </React.Fragment>
    );
  }

  render() {
    return (
      <Container>
        {this.state.isReady ? (
          this.renderContent()
        ) : (
          <p>Connecting to Home Assistant...</p>
        )}
        <ToastContainer
          position="bottom-right"
          hideProgressBar
          newestOnTop
          limit="1"
        />
      </Container>
    );
  }
}
