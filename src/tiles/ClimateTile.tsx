import React from "react";

import Tile, { TileProps } from "./Tile";
import { toTitleCase } from "../utils";

type ClimateTileProps = TileProps & {
  entityId: string;
  unit?: string;
};

export default class ClimateTile extends Tile<ClimateTileProps> {
  static defaultIcon = "thermomoter";

  getUnit(entityId: string): string {
    if (this.props.unit) return this.props.unit;
    const {
      attributes: { unit_of_measurement },
    } = this.getEntity(entityId);
    return unit_of_measurement || "";
  }

  renderBody() {
    const { attributes } = this.getEntity(this.props.entityId);
    return (
      <div className="tile-climate">
        {attributes.temperature}
        <span className="unit">{this.getUnit(this.props.entityId)}</span>
      </div>
    );
  }

  renderStatus() {
    const { attributes } = this.getEntity(this.props.entityId);
    return (
      <React.Fragment>
        Currently {attributes.current_temperature}
        <span className="unit">{this.getUnit(this.props.entityId)}</span>
      </React.Fragment>
    );
  }

  renderSubtitle() {
    const { attributes } = this.getEntity(this.props.entityId);
    return toTitleCase(attributes.hvac_action);
  }

  getDefaultIcon() {
    const { state } = this.getEntity(this.props.entityId);
    switch (state) {
      case "heat":
        return "thermometer-high";
      case "cool":
        return "thermometer-low";
      default:
        return super.getDefaultIcon();
    }
  }
}
