import Tile, { TileProps } from "./Tile";

type FanTileProps = TileProps & {
  entityId: string;
};

export default class FanTile extends Tile<FanTileProps> {
  onTouch = async () => {
    const { state } = this.getEntity(this.props.entityId);
    await this.callService(
      "fan",
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
