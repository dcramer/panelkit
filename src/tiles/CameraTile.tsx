import React from "react";

import Thumbnail from "../components/Thumbnail";
import Tile, { TileProps, TileState } from "./Tile";
import CameraModal, { CameraModalProps } from "../components/CameraModal";
import { CommandResult } from "../hass";

type CameraTileProps = TileProps & {
  entityId: string;
  refreshInterval?: number;
};

type ThumbnailResult = {
  content: string;
  content_type: string;
};

type FetchCameraThumbnailCommandResult = {
  result: ThumbnailResult;
} & CommandResult;

type CameraTileState = TileState & {
  loading: boolean;
  result: ThumbnailResult | null;
};

export default class CameraTile extends Tile<CameraTileProps, CameraTileState> {
  readonly state: CameraTileState = {
    loading: true,
    result: null,
    modalIsOpen: false,
  };

  static defaultProps = {
    refreshInterval: 3000,
  };

  private _timer?: number;

  componentDidMount() {
    super.componentDidMount();
    this.refreshCameraImage();
  }

  componentWillUnmount() {
    super.componentWillUnmount();
    if (this._timer) clearTimeout(this._timer);
  }

  getWatchedEntityIds() {
    return [];
  }

  refreshCameraImage = () => {
    return this.props.hass
      .fetchCameraThumbnail(this.props.entityId)
      .then(({ result }: FetchCameraThumbnailCommandResult) => {
        this.setState({
          result,
          loading: false,
        });
      })
      .then(() => {
        this._timer = setTimeout(
          this.refreshCameraImage,
          this.props.refreshInterval
        );
      });
  };

  onTouch = () => {
    this.openModal();
  };

  renderModal(params: CameraModalProps) {
    return <CameraModal {...params} />;
  }

  renderStatus() {}

  renderCover() {
    const { loading, result } = this.state;
    if (loading || !result) return <div>loading camera</div>;
    return <Thumbnail result={result} alt={this.props.entityId} />;
  }
}
