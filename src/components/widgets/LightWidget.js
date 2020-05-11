import PropTypes from "prop-types";

import Widget, { WidgetProps } from "../Widget";

import { mdiLightbulb, mdiLightbulbOn } from "@mdi/js";

export default class LightWidget extends Widget {
  static propTypes = {
    ...WidgetProps,
    entityId: PropTypes.string.isRequired,
  };

  getWatchedEntityIds() {
    return [this.props.entityId];
  }

  onClick = async () => {
    const { state } = this.getEntity(this.props.entityId);
    await this.callService("light", state === "on" ? "turn_off" : "turn_on", {
      entity_id: this.props.entityId,
    });
  };

  getIcon() {
    if (this.props.icon) return this.props.icon;
    const { state } = this.getEntity(this.props.entityId);
    return state === "on" ? mdiLightbulbOn : mdiLightbulb;
  }
}
