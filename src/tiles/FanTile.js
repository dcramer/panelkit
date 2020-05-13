import PropTypes from "prop-types";

import Tile, { TileProps } from "./Tile";

export default class FanTile extends Tile {
  static propTypes = {
    ...TileProps,
    entityId: PropTypes.string.isRequired,
  };

  onClick = async () => {
    const { state } = this.getEntity(this.props.entityId);
    await this.callService("fan", state === "on" ? "turn_off" : "turn_on", {
      entity_id: this.props.entityId,
    });
  };

  getDefaultIcon() {
    const { state } = this.getEntity(this.props.entityId);
    return state === "on" ? "fan" : "fan-off";
  }

  renderStatus() {
    const {
      state,
      attributes: { speed },
    } = this.getEntity(this.props.entityId);
    return state === "on" ? `Speed ${speed}` : "Off";
  }
}
