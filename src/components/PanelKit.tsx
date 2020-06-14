import React, { Component } from "react";
import styled from "styled-components";
import { ToastContainer, toast } from "react-toastify";
import { Flex, Box } from "reflexbox/styled-components";
import * as Sentry from "@sentry/browser";
import { CaptureConsole as CaptureConsoleIntegration } from "@sentry/integrations";

import "react-toastify/dist/ReactToastify.css";
import "../Toast.css";

import { Config, TileConfig } from "../types";
import HomeAssistant from "../hass";
import EventManager from "./EventManager";
import Header from "./Header";
import TileErrorBoundary from "./TileErrorBoundary";

const Container = styled.div``;

interface Props {
  config: Config;
  gridWidth: number;
  tileSize: number;
}

interface State {
  isReady: boolean;
}

export default class PanelKit extends Component<Props, State> {
  static defaultProps = {
    gridWidth: 8,
    tileSize: 167,
  };

  hass: HomeAssistant;

  readonly state = {
    isReady: false,
  };

  constructor(props: Props, context: any) {
    super(props, context);

    const sentryDsn =
      process.env.REACT_APP_SENTRY_DSN || this.props.config.sentryDsn;
    if (sentryDsn) {
      console.log(`[sentry] Initialized with DSN: ${sentryDsn}`);
      Sentry.init({
        dsn: sentryDsn,
        integrations: [
          new CaptureConsoleIntegration({
            levels: ["warn", "error"],
          }),
        ],
      });
    }

    const url =
      process.env.REACT_APP_HASS_URL ||
      this.props.config.url ||
      "http://localhost:8123";

    Sentry.setTag("hass.url", url);

    this.hass = new HomeAssistant({
      // we prioritize the environment variables to ease development
      url,
      accessToken:
        process.env.REACT_APP_HASS_ACCESS_TOKEN ||
        this.props.config.accessToken ||
        "",
      onReady: this.onReady,
      onError: (error: Error | ErrorEvent) => {
        Sentry.captureException(error);
        toast.error(error.message);
      },
      onOpen: () => {
        toast.success("Connected to Home Assistant.");
      },
    });
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
  getCameraList(): string[] {
    const results: string[] = [];
    function recurse(tiles: TileConfig[]) {
      tiles.forEach((tile) => {
        if (tile.tiles) recurse(tile.tiles);
        else if (tile.entityId && tile.entityId.indexOf("camera.") === 0)
          results.push(tile.entityId);
      });
    }
    recurse(this.props.config.tiles);
    return results;
  }

  renderTiles(tiles: TileConfig[], colWidth = 1, depth = 0) {
    const hass = this.hass;
    const cameraList = this.getCameraList();
    const { tileSize } = this.props;
    return (
      <Flex flexWrap="wrap" alignContent="space-evenly" p={depth ? "10px" : 0}>
        {tiles.map((tile, index) => {
          let { width, height } = tile;
          if (!width) width = 1;
          if (!height) height = 1;

          width = Math.min(width, colWidth);

          if (tile.tiles) {
            return (
              <Box key={index} width={[1, 1 / 2, width / colWidth]}>
                {this.renderTiles(tile.tiles, width, depth + 1)}
              </Box>
            );
          } else {
            return (
              <Box
                key={index}
                width={[1 / 2, width / colWidth]}
                p="4px"
                style={{ minHeight: tileSize * height }}
              >
                <TileErrorBoundary>
                  <tile.type hass={hass} cameraList={cameraList} {...tile} />
                </TileErrorBoundary>
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
        {this.props.config.events && (
          <EventManager hass={this.hass} events={this.props.config.events} />
        )}
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
          limit={1}
        />
      </Container>
    );
  }
}
