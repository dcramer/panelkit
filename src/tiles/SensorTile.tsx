import React from "react";

import Tile, { TileProps } from "./Tile";
import { EntityAttributes } from "../types";

type SensorTileProps = TileProps & {
  entityId: string;
  format: Function;
  unit?: string;
};

type SensorAttributes = EntityAttributes & {
  unit_of_measurement?: string;
};

export default class SensorTile extends Tile<SensorTileProps> {
  static defaultProps = {
    format: (
      state: string,
      attributes: EntityAttributes,
      unitOfMeasurement: string | null = null
    ) => (
      <React.Fragment>
        {state}
        <span className="unit">{unitOfMeasurement}</span>
      </React.Fragment>
    ),
  };

  getUnit(entityId: string) {
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
