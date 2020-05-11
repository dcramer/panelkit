import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Grid, Cell } from "styled-css-grid";

import { hassInit } from "./features/hass";

export class App extends Component {
  static propTypes = {
    host: PropTypes.string,
    accessToken: PropTypes.string,
  };

  static defaultProps = {
    host: process.env.REACT_APP_HASS_HOST || "localhost:8123",
    accessToken: process.env.REACT_APP_HASS_ACCESS_TOKEN,
  };

  componentDidMount() {
    this.props.hassInit(this.props.host, this.props.accessToken);
  }

  render() {
    return (
      <Grid columns={12}>
        <Cell width={1}>1/12</Cell>
        <Cell width={1}>2/12</Cell>
        <Cell width={2}>1/6</Cell>
        <Cell width={2}>2/6</Cell>
      </Grid>
    );
  }
}

export default connect(
  (state) => {
    return {
      // counter: state.counter,
    };
  },
  { hassInit }
)(App);
