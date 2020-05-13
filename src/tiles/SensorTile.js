import React from "react";
import PropTypes from "prop-types";

import Tile, { TileProps } from "./Tile";

export default class SensorTile extends Tile {
  static propTypes = {
    ...TileProps,
    entityId: PropTypes.string.isRequired,
    format: PropTypes.function,
    unit: PropTypes.string,
  };

  static defaultProps = {
    format: (state, _attributes, unitOfMeasurement = null) => (
      <React.Fragment>
        {state} <span className="unit">{unitOfMeasurement}</span>
      </React.Fragment>
    ),
  };

  renderBody() {
    const { state, attributes } = this.getEntity(this.props.entityId);
    return this.props.format(
      state,
      attributes,
      this.props.unit || attributes.unit_of_measurement
    );
  }

  renderStatus() {}
}
