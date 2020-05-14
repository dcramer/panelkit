import React from "react";

import Tile from "./Tile";
import DoorControlModal from "../components/DoorControlModal";

export default class DoorControlTile extends Tile {
  static defaultIcon = "door";

  onTouch = () => {
    if (this.state.showModal) return;
    this.setState({ showModal: true });
  };

  closeModal = () => {
    this.setState({ showModal: false });
  };

  renderBody() {
    return (
      <React.Fragment>
        {super.renderBody()}
        <DoorControlModal
          hass={this.props.hass}
          name={this.renderTitle()}
          camera={this.props.camera}
          isOpen={this.state.showModal}
          onRequestClose={this.closeModal}
        />
      </React.Fragment>
    );
  }

  renderTitle() {
    return this.props.title || "Door Control";
  }
}
