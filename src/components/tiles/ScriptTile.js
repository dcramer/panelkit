import PropTypes from "prop-types";

import Tile, { TileProps } from "../Tile";

export default class ScriptTile extends Tile {
  static propTypes = {
    ...TileProps,
    id: PropTypes.string.isRequired,
    data: PropTypes.object,
  };

  onClick = async () => {
    await this.callService("script", this.props.id, this.props.data);
  };

  renderLabel() {
    return this.props.name || this.props.id;
  }

  renderStatus() {}
}
