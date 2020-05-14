import PropTypes from "prop-types";

import Tile, { TileProps } from "./Tile";

export default class SwitchTile extends Tile {
  static propTypes = {
    ...TileProps,
    entityId: PropTypes.string.isRequired,
  };

  getDefaultIcon() {
    const { state } = this.getEntity(this.props.entityId);
    switch (state) {
      case "on":
        return "toggle-switch";
      case "off":
        return "toggle-switch-off";
      default:
        return "toggle-switch";
    }
  }

  onTouch = async () => {
    const { state } = this.getEntity(this.props.entityId);
    await this.callService(
      "switch",
      state === "on" ? "turn_off" : "turn_on",
      {
        entity_id: this.props.entityId,
      },
      {
        [this.props.entityId]: { state: state === "on" ? "off" : "on" },
      }
    );
  };

  renderStatus() {}
}
