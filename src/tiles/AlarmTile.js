import PropTypes from "prop-types";

import Tile, { TileProps } from "./Tile";

export default class AlarmTile extends Tile {
  static propTypes = {
    ...TileProps,
    entityId: PropTypes.string.isRequired,
  };

  getDefaultIcon() {
    const { state } = this.getEntity(this.props.entityId);
    return state === "armed_home" || state === "armed_away"
      ? "bell"
      : "bell-off";
  }
}
