import React from "react";
import PropTypes from "prop-types";

import Tile, { TileProps } from "./Tile";
import DoorControlModal from "../components/DoorControlModal";

export default class DoorControlTile extends Tile {
  static defaultIcon = "door";

  static PropTypes = {
    ...TileProps,
    camera: PropTypes.string.isRequired,
  };

  onTouch = () => {
    this.openModal();
  };

  renderModal({ ...props }) {
    console.log(this.props);
    return (
      <DoorControlModal
        title={this.props.title}
        camera={this.props.camera}
        {...props}
      />
    );
  }

  renderTitle() {
    return this.props.title || "Door Control";
  }
}
