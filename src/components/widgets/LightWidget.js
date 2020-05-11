import React from "react";
import PropTypes from "prop-types";

import Widget, { WidgetProps } from "../Widget";

import Icon from "@mdi/react";
import { mdiLightbulb, mdiLightbulbOn } from "@mdi/js";

export default class LightWidget extends Widget {
  static propTypes = {
    ...WidgetProps,
    name: PropTypes.string,
    entityId: PropTypes.string.isRequired,
  };

  getInitialState() {
    return {
      loading: true,
    };
  }

  getWatchedEntityIds() {
    return [this.props.entityId];
  }

  renderBody() {
    const {
      state,
      attributes: { friendly_name },
    } = this.getEntity(this.props.entityId);
    return (
      <div>
        {this.props.name || friendly_name} {state.state}
        <Icon path={state === "on" ? mdiLightbulbOn : mdiLightbulb} />
      </div>
    );
  }
}
