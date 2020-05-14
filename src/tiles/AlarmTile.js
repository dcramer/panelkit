import React from "react";
import PropTypes from "prop-types";

import Tile, { TileProps } from "./Tile";
import AlarmModal from "../components/AlarmModal";

const ARMED_STATES = new Set(["armed_home", "armed_away", "armed_night"]);

export default class AlarmTile extends Tile {
  static propTypes = {
    ...TileProps,
    entityId: PropTypes.string.isRequired,
  };

  onTouch = () => {
    const { state } = this.getEntity(this.props.entityId);
    if (ARMED_STATES.has(state)) {
      this.callService(
        "alarm_control_panel",
        "alarm_disarm",
        {
          entity_id: this.props.entityId,
        },
        {
          [this.props.entityId]: {
            state: "disarmed",
          },
        }
      );
    } else {
      this.openModal();
    }
  };

  renderModal({ ...props }) {
    return <AlarmModal {...props} />;
  }
  getDefaultIcon() {
    const { state } = this.getEntity(this.props.entityId);
    switch (state) {
      case "armed_home":
      case "armed_away":
      case "armed_night":
        return "bell";
      case "triggered":
        return "bell-ring";
      case "disarmed":
        return "bell-off";
      default:
        return "bell";
    }
  }
}
