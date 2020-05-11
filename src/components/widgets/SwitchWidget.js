import PropTypes from "prop-types";

import Widget, { WidgetProps } from "../Widget";

export default class SwitchWidget extends Widget {
  static propTypes = {
    ...WidgetProps,
    entityId: PropTypes.string.isRequired,
  };

  getWatchedEntityIds() {
    return [this.props.entityId];
  }

  onClick = async () => {
    const { state } = this.getEntity(this.props.entityId);
    await this.callService("switch", state === "on" ? "turn_off" : "turn_on", {
      entity_id: this.props.entityId,
    });
  };
}
