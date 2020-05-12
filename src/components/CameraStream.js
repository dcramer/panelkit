import React, { Component } from "react";
import PropTypes from "prop-types";
import Hls from "hls.js";

export default class CameraStream extends Component {
  static propTypes = {
    hass: PropTypes.object.isRequired,
    entityId: PropTypes.string.isRequired,
    accessToken: PropTypes.string,
  };

  constructor(...params) {
    super(...params);
    this.state = {
      videoUrl: true,
    };
    this.playerRef = React.createRef();
  }

  componentWillMount() {
    this.props.hass
      .sendCommand({
        type: "camera/stream",
        entity_id: this.props.entityId,
      })
      .then(({ result: { url } }) => {
        var hls = new Hls({
          maxBufferLength: 5,
          maxMaxBufferLength: 5,
        });
        hls.loadSource(this.props.hass.buildUrl(url));
        hls.attachMedia(this.playerRef.current);
        hls.on(Hls.Events.MANIFEST_PARSED, function () {
          this.playerRef.current.play();
        });
        this.setState({ videoUrl: url });
      })
      .catch((err) => {
        console.error({ err });
      });
  }

  render() {
    const { videoUrl } = this.state;
    if (videoUrl) {
      return (
        <video
          ref={this.playerRef}
          autoPlay
          muted
          playsInline
          style={{ pointerEvents: "none" }}
        />
      );
    }
    if (!this.props.accessToken) return;
    return (
      <img
        src={this.props.hass.buildUrl(
          `/api/camera_proxy_stream/${this.props.entityId}?token=${this.props.accessToken}`
        )}
        alt={this.props.entityId}
      />
    );
  }
}
