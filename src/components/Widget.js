import React, { Component } from "react";
import PropTypes from "prop-types";

export default class Widget extends Component {
  static propTypes = {
    hass: PropTypes.object.isRequired,
  };

  constructor(...params) {
    super(...params);
    this.state = this.getInitialState();
  }

  getInitialState() {
    return {};
  }

  componentDidMount() {
    // this.props.subscribeEvents(this.props.host, this.props.accessToken);
  }

  render() {
    return <div>widget!</div>;
  }
}
