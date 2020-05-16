import React, { Component } from "react";
import styled from "styled-components";
import { ToastContainer, toast } from "react-toastify";
import { Flex, Box } from "reflexbox/styled-components";
import * as Sentry from "@sentry/browser";
import { CaptureConsole as CaptureConsoleIntegration } from "@sentry/integrations";

import "react-toastify/dist/ReactToastify.css";
import "./Toast.css";

import { Config, TileConfig } from "./types";
import HomeAssistant from "./hass";
import Header from "./components/Header";

const ConfigContainer = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  top: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 30px;
`;

const ConfigErrorContainer = styled.div`
  color: white;
  padding: 30px 30px 0;
  font-size: 14pt;
  width: 700px;
  background: rgba(255, 255, 255, 0.1);

  p,
  h2,
  dl {
    margin: 0;
    padding: 0 0 30px;
  }

  dl {
    position: relative;
    line-height: 1.5em;
  }
  dl dt {
    position: absolute;
    left: 0;
    width: 100px;
    color: rgba(255, 255, 255, 0.7);
  }
  dl dd {
    margin-left: 100px;
  }
`;

const Container = styled.div``;

interface PanelKitProps {
  config: Config;
  gridWidth: number;
  tileSize: number;
}

interface PanelKitState {
  isReady: boolean;
}

class PanelKit extends Component<PanelKitProps, PanelKitState> {
  static defaultProps = {
    gridWidth: 8,
    tileSize: 167,
  };

  hass: HomeAssistant;

  constructor(props: PanelKitProps) {
    super(props);

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
      onError: (error: Error) => {
        Sentry.captureException(error);
        toast.error(error.message);
      },
      onOpen: () => {
        toast.success("Connected to Home Assistant.");
      },
    });

    this.state = {
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
          limit={1}
        />
      </Container>
    );
  }
}

interface AppProps {
  config: Config;
  configError: ErrorEvent | null;
}

export default class App extends Component<AppProps> {
  render() {
    const { configError } = this.props;
    if (configError) {
      return (
        <ConfigContainer>
          <ConfigErrorContainer>
            <h2>Configuration Error</h2>
            <p>
              We hit an unexpected error while loading your{" "}
              <code>config.js</code>.
            </p>
            <dl>
              <dt>File:</dt>
              <dd>
                <a href={configError.filename}>{configError.filename}</a>
              </dd>
              <dt>Error:</dt>
              <dd>{configError.message}</dd>
            </dl>
          </ConfigErrorContainer>
        </ConfigContainer>
      );
    }
    return <PanelKit config={this.props.config} />;
  }
}
