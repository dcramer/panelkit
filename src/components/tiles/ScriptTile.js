import PropTypes from "prop-types";

import Tile, { TileProps } from "../Tile";

export default class ScriptTile extends Tile {
  static propTypes = {
    ...TileProps,
    entityId: PropTypes.string.isRequired,
    data: PropTypes.object,
  };

  onClick = async () => {
    let [domain, service] = this.props.entityId.split(".", 2);
    await this.callService(domain, service, this.props.data);
  };

  renderTitle() {
    return this.props.title || this.props.entityId;
  }

  renderStatus() {}
}
