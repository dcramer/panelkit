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

  componentDidMount() {
    this.getWatchedEntityIds().forEach((entityId) => {
      this._activeSubscriptions.push(
        this.props.hass.subscribe(entityId, this.onStateChange)
      );
    });
  }

  componentWillUnmount() {
    this._activeSubscriptions.forEach((sub) => {
      this.props.hass.unsubscribe(...sub);
    });
  }

  /* Defines a list of entity IDs to monitor for update.
   *
   * When an entity is updated, it will call `onStateChange`, which
   * by default will simply force the widget to re-render.
   */
  getWatchedEntityIds() {
    return [];
  }

  getEntity(entityId) {
    return this.props.hass.getState(entityId);
  }

  callService(domain, service, serviceData) {
    return this.props.hass.callService(domain, service, serviceData);
  }

  onStateChange = (_entityId, _newState, _oldState) => {
    // XXX(dcramer): Yes, you shouldn't do this. No I don't care about your opinions.
    this.forceUpdate();
  };

  onClick = null;

  render() {
    return (
      <div
        className="widget"
        onClick={this.onClick}
        style={{ cursor: this.onClick ? "pointer" : "none" }}
      >
        {this.renderBody()}
      </div>
    );
  }

  renderBody() {}
}
