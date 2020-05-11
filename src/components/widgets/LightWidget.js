import React from "react";
import PropTypes from "prop-types";

import Widget, { WidgetProps } from "../Widget";

export default class LightWidget extends Widget {
  static propTypes = {
    ...WidgetProps,
    name: PropTypes.string,
    entityId: PropTypes.string.isRequired,
  };

  getInitialState() {
    return {
      loading: true,
      currentState: null,
    };
  }

  getSubscriptions() {
    return [[this.props.entityId, this.onStateChange]];
  }

  onStateChange = (_entityId, newState, _oldState) => {
    this.forceUpdate();
  };

  render() {
    const state = this.props.hass.getState(this.props.entityId);
    return (
      <div>
        {this.props.name || state.attributes.friendly_name} {state.state}
      </div>
    );
  }
}
