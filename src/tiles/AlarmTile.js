import PropTypes from "prop-types";

import Tile, { TileProps } from "./Tile";

export default class AlarmTile extends Tile {
  static propTypes = {
    ...TileProps,
    entityId: PropTypes.string.isRequired,
  };

  getDefaultIcon() {
    const { state } = this.getEntity(this.props.entityId);
    switch (state) {
      case "armed_home":
      case "armed_away":
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
