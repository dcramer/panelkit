import PropTypes from "prop-types";

import Tile, { TileProps } from "../Tile";

export default class SwitchTile extends Tile {
  static propTypes = {
    ...TileProps,
    entityId: PropTypes.string.isRequired,
  };

  getWatchedEntityIds() {
    return [this.props.entityId];
  }

  onClick = async () => {
    const { state } = this.getEntity(this.props.entityId);
    await this.callService("switch", state === "on" ? "turn_off" : "turn_on", {
      entity_id: this.props.entityId,
    });
  };

  renderStatus() {}
}
