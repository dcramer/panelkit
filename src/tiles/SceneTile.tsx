import Tile, { TileProps } from "./Tile";

type SceneTileProps = TileProps & {
  entityId: string;
};

export default class SceneTile extends Tile<SceneTileProps> {
  onTouch = () => {
    this.callService("scene", "turn_on", {
      entity_id: this.props.entityId,
    });
  };

  renderStatus() {}
}
