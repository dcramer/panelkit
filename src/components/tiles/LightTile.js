import PropTypes from "prop-types";

import Tile, { TileProps } from "../Tile";

import { mdiLightbulb, mdiLightbulbOn } from "@mdi/js";

export default class LightTile extends Tile {
  static propTypes = {
    ...TileProps,
    entityId: PropTypes.string.isRequired,
  };

  getWatchedEntityIds() {
    return [this.props.entityId];
  }

  onClick = async () => {
    const { state } = this.getEntity(this.props.entityId);
    await this.callService("light", state === "on" ? "turn_off" : "turn_on", {
      entity_id: this.props.entityId,
    });
  };

  getIcon() {
    if (this.props.icon) return this.props.icon;
    const { state } = this.getEntity(this.props.entityId);
    return state === "on" ? mdiLightbulbOn : mdiLightbulb;
  }
}
