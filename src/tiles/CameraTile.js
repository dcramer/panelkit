import React from "react";
import PropTypes from "prop-types";

import Thumbnail from "../components/Thumbnail";
import Tile, { TileProps } from "./Tile";
import CameraModal from "../components/CameraModal";

export default class CameraTile extends Tile {
  static propTypes = {
    ...TileProps,
    entityId: PropTypes.string.isRequired,
    refreshInterval: PropTypes.number,
  };

  static defaultProps = {
    refreshInterval: 3000,
  };

  getInitialState() {
    return {
      loading: true,
      result: null,
      showModal: false,
    };
  }

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
      .then(({ result }) => {
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
    if (this.state.showModal) return;
    this.setState({ showModal: true });
  };

  closeModal = () => {
    this.setState({ showModal: false });
  };

  renderBody() {
    return (
      <CameraModal
        hass={this.props.hass}
        entityId={this.props.entityId}
        isOpen={this.state.showModal}
        onRequestClose={this.closeModal}
        cameraList={this.props.cameraList}
      />
    );
  }

  renderStatus() {}

  renderCover() {
    const { loading, result } = this.state;
    if (loading) return <div>loading camera</div>;
    return <Thumbnail result={result} alt={this.props.entityId} />;
  }
}
