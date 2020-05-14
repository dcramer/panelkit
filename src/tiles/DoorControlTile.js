import React from "react";

import Tile from "./Tile";
import DoorControlModal from "../components/DoorControlModal";

export default class DoorControlTile extends Tile {
  static defaultIcon = "door";

  onTouch = () => {
    this.openModal();
  };

  renderModal({ ...props }) {
    return <DoorControlModal {...props} />;
  }

  renderTitle() {
    return this.props.title || "Door Control";
  }
}
