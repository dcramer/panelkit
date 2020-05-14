import PropTypes from "prop-types";

import Tile, { TileProps } from "./Tile";

export default class LightTile extends Tile {
  static propTypes = {
    ...TileProps,
    entityId: PropTypes.string.isRequired,
  };

  onTouch = async () => {
    const { state } = this.getEntity(this.props.entityId);
    await this.callService(
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

  getDefaultIcon() {
    const { state } = this.getEntity(this.props.entityId);
    return state === "on" ? "lightbulb-on" : "lightbulb";
  }
}
