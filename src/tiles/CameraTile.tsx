import React from "react";

import Thumbnail from "../components/Thumbnail";
import Tile, { TileProps, TileState } from "./Tile";
import CameraModal, { CameraModalProps } from "../modals/CameraModal";

type CameraTileProps = TileProps & {
  entityId: string;
  refreshInterval?: number;
};

type CameraTileState = TileState & {
  loading: boolean;
  cameraUrl: string | null;
};

export default class CameraTile extends Tile<CameraTileProps, CameraTileState> {
  readonly state: CameraTileState = {
    loading: true,
    cameraUrl: null,
    modalIsOpen: false,
    isLoading: false,
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

  async getCameraThumbnailUrl() {
    const { hass, entityId } = this.props;
    const result = await hass.signPath(`/api/camera_proxy/${entityId}`);
    return result;
  }

  refreshCameraImage = () => {
    this.getCameraThumbnailUrl()
      .then((cameraUrl) => {
        this.setState({
          cameraUrl,
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
    const { loading, cameraUrl } = this.state;
    if (loading || !cameraUrl) return <div>loading camera</div>;
    return (
      <Thumbnail
        url={this.props.hass.buildUrl(cameraUrl)}
        alt={this.props.entityId}
      />
    );
  }
}
