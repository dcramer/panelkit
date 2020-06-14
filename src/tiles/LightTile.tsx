import React from "react";

import Tile, { TileProps } from "./Tile";
import LightModal, { LightModalProps } from "../modals/LightModal";

type LightTileProps = TileProps & {
  entityId: string;
};

export default class LightTile extends Tile<LightTileProps> {
  onTouch = () => {
    const { state } = this.getEntity(this.props.entityId);
    this.callService(
      "light",
      state === "on" ? "turn_off" : "turn_on",
      {
        entity_id: this.props.entityId,
      },
      {
        [this.props.entityId]: { state: state === "on" ? "off" : "on" },
      }
    );
  };

  onLongTouch = () => {
    this.openModal();
  };

  renderModal(params: LightModalProps) {
    return <LightModal {...params} />;
  }

  getDefaultIcon() {
    const { state } = this.getEntity(this.props.entityId);
    return state === "on" ? "lightbulb-on" : "lightbulb";
  }
}
