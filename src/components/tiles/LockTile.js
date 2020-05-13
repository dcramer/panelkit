import PropTypes from "prop-types";

import Tile, { TileProps } from "../Tile";

export default class LockTile extends Tile {
  static propTypes = {
    ...TileProps,
    entityId: PropTypes.string.isRequired,
  };

  getWatchedEntityIds() {
    return [this.props.entityId];
  }

  onClick = async () => {
    const { state } = this.getEntity(this.props.entityId);
    await this.callService("lock", state === "locked" ? "unlock" : "lock", {
      entity_id: this.props.entityId,
    });
  };

  getDefaultIcon() {
    const { state } = this.getEntity(this.props.entityId);
    return state === "locked" ? "lock" : "lock-open";
  }
}
