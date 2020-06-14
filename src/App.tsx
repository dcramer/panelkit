import React, { Component } from "react";
import styled from "styled-components";

import { Config } from "./types";
import PanelKit from "./components/PanelKit";

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

interface Props {
  config: Config;
  configError?: ErrorEvent | null;
}

export default class App extends Component<Props> {
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
