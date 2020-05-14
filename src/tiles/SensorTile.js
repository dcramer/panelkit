import React from "react";
import PropTypes from "prop-types";

import Tile, { TileProps } from "./Tile";

export default class SensorTile extends Tile {
  static propTypes = {
    ...TileProps,
    entityId: PropTypes.string.isRequired,
    format: PropTypes.func,
    unit: PropTypes.string,
  };

  static defaultProps = {
    format: (state, _attributes, unitOfMeasurement = null) => (
      <React.Fragment>
        {state}
        <span className="unit">{unitOfMeasurement}</span>
      </React.Fragment>
    ),
  };

  getUnit(entityId) {
    if (this.props.unit) return this.props.unit;
    const {
      attributes: { unit_of_measurement },
    } = this.getEntity(entityId);
    return unit_of_measurement || "";
  }

  renderBody() {
    const { state, attributes } = this.getEntity(this.props.entityId);
    return (
      <div className="tile-sensor">
        {this.props.format(
          state,
          attributes,
          this.getUnit(this.props.entityId)
        )}
      </div>
    );
  }

  renderStatus() {}
}
