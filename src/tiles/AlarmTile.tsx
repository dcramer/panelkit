import React from "react";

import Tile, { TileProps } from "./Tile";
import AlarmModal, { AlarmModalProps } from "../modals/AlarmModal";

const ARMED_STATES = new Set(["armed_home", "armed_away", "armed_night"]);

type AlarmTileProps = TileProps & {
  entityId: string;
};

export default class AlarmTile extends Tile<AlarmTileProps> {
  onTouch = async () => {
    const { state } = this.getEntity(this.props.entityId);
    if (ARMED_STATES.has(state)) {
      await this.callService(
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

  renderModal(params: AlarmModalProps) {
    return <AlarmModal {...params} />;
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
