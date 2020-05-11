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
    this._activeSubscriptions = [];
  }

  getInitialState() {
    return {};
  }

  getSubscriptions() {
    return [
      // [entityId, callback]
    ];
  }

  componentDidMount() {
    this.getSubscriptions().forEach((sub) => {
      this._activeSubscriptions.push(this.props.hass.subscribe(...sub));
    });
  }

  componentWillUnmount() {
    this._activeSubscriptions.forEach((sub) => {
      this.props.hass.unsubscribe(...sub);
    });
  }

  render() {
    return <div>widget!</div>;
  }
}
