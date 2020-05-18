import React from "react";

import Tile, { TileProps, ModalParams } from "./Tile";
import DoorControlModal from "../components/DoorControlModal";

type DoorControlTileProps = TileProps & {
  camera: string;
  title: string;
};

export default class DoorControlTile extends Tile<DoorControlTileProps> {
  static defaultIcon = "door";

  onTouch = () => {
    this.openModal();
  };

  renderModal(params: ModalParams) {
    return (
      <DoorControlModal
        title={this.props.title}
        camera={this.props.camera}
        {...params}
      />
    );
  }

  renderTitle() {
    return this.props.title || "Door Control";
  }
}
