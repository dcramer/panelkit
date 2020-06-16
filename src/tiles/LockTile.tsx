import Tile, { TileProps } from "./Tile";

type LockTileProps = TileProps & {
  entityId: string;
};

export default class LockTile extends Tile<LockTileProps> {
  onTouch = async () => {
    const { state } = this.getEntity(this.props.entityId);
    await this.callService(
      "lock",
      state === "locked" ? "unlock" : "lock",
      {
        entity_id: this.props.entityId,
      },
      {
        [this.props.entityId]: {
          state: state === "locked" ? "unlocked" : "locked",
        },
      }
    );
  };

  getDefaultIcon() {
    const { state } = this.getEntity(this.props.entityId);
    return state === "locked" ? "lock" : "lock-open";
  }
}
