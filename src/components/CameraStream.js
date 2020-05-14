import React, { Component } from "react";
import PropTypes from "prop-types";
import Hls from "hls.js";
import { toast } from "react-toastify";

// You __must__ use key=entityId to ensure the video player updates on prop changes
export default class CameraStream extends Component {
  static propTypes = {
    hass: PropTypes.object.isRequired,
    entityId: PropTypes.string.isRequired,
    accessToken: PropTypes.string.isRequired,
  };

  constructor(...params) {
    super(...params);
    this.state = {
      videoLoaded: false,
    };
    this.playerRef = React.createRef();
  }

  componentDidMount() {
    this.loadVideoStream(this.props);
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
        this.hls.attachMedia(this.playerRef.current);
        this.hls.on(Hls.Events.MEDIA_ATTACHED, () => {
          this.hls.loadSource(hass.buildUrl(url));
        });
        this.hls.on(Hls.Events.MANIFEST_PARSED, () => {
          this.playerRef.current.play();
          this.setState({ videoLoaded: true });
        });
      })
      .catch((err) => {
        toast.error(err.message);
      });
  }

  render() {
    return (
      <React.Fragment>
        <video
          ref={this.playerRef}
          autoPlay
          muted
          playsInline
          style={{
            pointerEvents: "none",
            display: this.state.videoLoaded ? "block" : "none",
          }}
        />
        {!this.state.videoLoaded && (
          <img
            src={this.props.hass.buildUrl(
              `/api/camera_proxy_stream/${this.props.entityId}?token=${this.props.accessToken}`
            )}
            alt={this.props.entityId}
          />
        )}
      </React.Fragment>
    );
  }
}
