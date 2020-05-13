import PropTypes from "prop-types";

import Tile, { TileProps } from "./Tile";

export default class AutomationTile extends Tile {
  static propTypes = {
    ...TileProps,
    entityId: PropTypes.string.isRequired,
    data: PropTypes.object,
    action: PropTypes.oneOf(["turn_on", "turn_off", "trigger", "toggle"]),
  };

  static defaultProps = {
    action: "toggle",
  };

  static defaultIcon = "home-automation";

  onClick = async () => {
    await this.callService("automation", this.props.action, {
      entity_id: this.props.entityId,
    });
  };
}
