import Tile, { TileProps } from "./Tile";

type AutomationTileProps = TileProps & {
  entityId: string;
  data: any;
  // ["turn_on", "turn_off", "trigger", "toggle"]
  action: string;
};

export default class AutomationTile extends Tile<AutomationTileProps> {
  static defaultProps = {
    action: "toggle",
  };

  static defaultIcon = "home-automation";

  onTouch = () => {
    this.callService("automation", this.props.action, {
      entity_id: this.props.entityId,
    });
  };
}
