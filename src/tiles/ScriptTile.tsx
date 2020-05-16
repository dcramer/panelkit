import Tile, { TileProps } from "./Tile";

type ScriptTileProps = TileProps & {
  entityId: string;
  data?: any;
};

export default class ScriptTile extends Tile<ScriptTileProps> {
  static defaultIcon = "script";

  onTouch = () => {
    let [domain, service] = this.props.entityId.split(".", 2);
    this.callService(domain, service, this.props.data);
  };

  renderTitle() {
    return this.props.title || this.props.entityId;
  }
}
