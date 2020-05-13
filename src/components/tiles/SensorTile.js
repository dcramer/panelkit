import PropTypes from "prop-types";

import Tile, { TileProps } from "../Tile";

export default class SensorTile extends Tile {
  static propTypes = {
    ...TileProps,
    entityId: PropTypes.string.isRequired,
    format: PropTypes.function,
  };

  static defaultProps = {
    format: (state, attributes) => `${state} ${attributes.unit_of_measurement}`,
  };

  getWatchedEntityIds() {
    return [this.props.entityId];
  }

  renderBody() {
    const { state, attributes } = this.getEntity(this.props.entityId);
    return this.props.format(state, attributes);
  }

  renderStatus() {}
}
