import PropTypes from "prop-types";

import Widget, { WidgetProps } from "../Widget";

export default class SceneWidget extends Widget {
  static propTypes = {
    ...WidgetProps,
    entityId: PropTypes.string.isRequired,
  };

  getWatchedEntityIds() {
    return [this.props.entityId];
  }

  onClick = async () => {
    await this.callService("scene", "turn_on", {
      entity_id: this.props.entityId,
    });
  };
}
