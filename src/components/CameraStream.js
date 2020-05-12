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
    this.loadVideoStream(this.props);
  }

  // TOOD(dcramer): doesnt seem to work... not sure why
  // the bug is within loadVideoStream (HLS doesnt seem to remount)
  componentWillReceiveProps(nextProps) {
    if (this.props.entityId !== nextProps.entityId) {
      this.setState({ videoUrl: null });
      this.loadVideoStream(nextProps);
    }
  }

  componentWillUnmount() {
    this.hls && this.hls.destroy();
  }

  loadVideoStream({ hass, entityId }) {
    hass
      .sendCommand({
        type: "camera/stream",
        entity_id: entityId,
      })
      .then(({ result: { url } }) => {
        if (this.hls) this.hls.destroy();
        this.hls = new Hls({
          maxBufferLength: 5,
          maxMaxBufferLength: 5,
        });
        this.hls.on(Hls.Events.MANIFEST_PARSED, () => {
          this.playerRef.current.play();
        });
        this.hls.attachMedia(this.playerRef.current);
        this.hls.on(Hls.Events.MEDIA_ATTACHED, () => {
          this.hls.loadSource(hass.buildUrl(url));
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
