import PropTypes from "prop-types";

import Tile, { TileProps } from "./Tile";

export default class SceneTile extends Tile {
  static propTypes = {
    ...TileProps,
    entityId: PropTypes.string.isRequired,
  };

  onTouch = async () => {
    await this.callService("scene", "turn_on", {
      entity_id: this.props.entityId,
    });
  };

  renderStatus() {}
}
