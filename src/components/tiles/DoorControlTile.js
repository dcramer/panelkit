import { mdiDoor } from "@mdi/js";

import Tile from "../Tile";

export default class DoorControlTile extends Tile {
  getIcon() {
    if (this.props.icon) return this.props.icon;
    return mdiDoor;
  }

  renderLabel() {
    return this.props.name || "Door Control";
  }
}
