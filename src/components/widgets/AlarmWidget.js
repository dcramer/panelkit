import PropTypes from "prop-types";
import { mdiBell, mdiBellOff } from "@mdi/js";

import Widget, { WidgetProps } from "../Widget";

export default class AlarmWidget extends Widget {
  static propTypes = {
    ...WidgetProps,
    entityId: PropTypes.string.isRequired,
  };

  getIcon() {
    if (this.props.icon) return this.props.icon;
    const { state } = this.getEntity(this.props.entityId);
    return state === "armed_home" || state === "armed_away"
      ? mdiBell
      : mdiBellOff;
  }

  getWatchedEntityIds() {
    return [this.props.entityId];
  }
}
