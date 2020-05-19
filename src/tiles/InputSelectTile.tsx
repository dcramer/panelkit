import Tile, { TileProps } from "./Tile";

type InputSelectTileProps = TileProps & {
  entityId: string;
};

export default class InputSelectTile extends Tile<InputSelectTileProps> {
  onTouch = () => {
    const {
      state,
      attributes: { options },
    } = this.getEntity(this.props.entityId);
    const curOption = options.indexOf(state) || -1;
    const nextOption =
      curOption >= options.length - 1 ? options[0] : options[curOption + 1];
    this.callService("input_select", "select_option", {
      entity_id: this.props.entityId,
      option: nextOption,
    });
  };
}
