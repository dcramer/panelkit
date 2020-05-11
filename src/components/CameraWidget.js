import React from "react";
import PropTypes from "prop-types";

import CameraThumbnail from "./CameraThumbnail";
import Widget, { WidgetProps } from "./Widget";

export default class CameraWidget extends Widget {
  static propTypes = {
    ...WidgetProps,
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
    };
  }

  componentDidMount() {
    this.refreshCameraImage();
  }

  componentWillUnmount() {
    if (this._timer) clearTimeout(this._timer);
  }

  refreshCameraImage = () => {
    return this.props.hass
      .sendCommand({
        type: "camera_thumbnail",
        entity_id: this.props.entityId,
      })
      .then((result) => {
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

  render() {
    const { loading, result } = this.state;
    if (loading) return <div>loading camera</div>;
    return (
      <div>
        <CameraThumbnail result={result} alt={this.props.entityId} />
      </div>
    );
  }
}
