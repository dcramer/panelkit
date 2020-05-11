import { mdiDoor } from "@mdi/js";

import Widget from "../Widget";

export default class DoorControlWidget extends Widget {
  getIcon() {
    if (this.props.icon) return this.props.icon;
    return mdiDoor;
  }

  renderLabel() {
    return this.props.name || "Door Control";
  }
}
