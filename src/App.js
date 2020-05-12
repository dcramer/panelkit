import React, { Component } from "react";
import PropTypes from "prop-types";
import { Grid, Cell } from "styled-css-grid";
import styled from "styled-components";

import HomeAssistant from "./hass";

import Header from "./components/Header";

const Container = styled.div`
  padding: 20px;
`;

export default class App extends Component {
  static propTypes = {
    url: PropTypes.string,
    accessToken: PropTypes.string,
    config: PropTypes.shape({
      tiles: PropTypes.arrayOf(
        PropTypes.shape({
          type: PropTypes.elementType,
          name: PropTypes.string,
          tiles: PropTypes.array,
        })
      ).isRequired,
    }).isRequired,
    gridWidth: PropTypes.number.isRequired,
  };

  static defaultProps = {
    url: process.env.REACT_APP_HASS_URL || "http://localhost:8123",
    accessToken: process.env.REACT_APP_HASS_ACCESS_TOKEN,
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
        {this.renderTiles(this.props.config.tiles, this.props.gridWidth)}
      </Container>
    );
  }
}
