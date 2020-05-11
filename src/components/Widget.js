import React, { Component } from "react";
import PropTypes from "prop-types";

export const WidgetProps = Object.freeze({
  hass: PropTypes.object.isRequired,
});

export default class Widget extends Component {
  static propTypes = WidgetProps;

  constructor(...params) {
    super(...params);
    this.state = this.getInitialState();
  }

  getInitialState() {
    return {};
  }

  render() {
    return <div>widget!</div>;
  }
}
