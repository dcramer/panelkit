import React, { Component } from "react";
import Hls from "hls.js";
import { toast } from "react-toastify";

import HomeAssistant from "../hass";

type CameraStreamProps = {
  hass: HomeAssistant;
  entityId: string;
  accessToken: string;
};

type CameraStreamState = {
  videoLoaded: boolean;
};

type CameraStreamCommandResult = {
  result: {
    url: string;
  };
};

// You __must__ use key=entityId to ensure the video player updates on prop changes
export default class CameraStream extends Component<
  CameraStreamProps,
  CameraStreamState
> {
  private playerRef: any;
  private hls?: Hls;

  constructor(props: CameraStreamProps) {
    super(props);
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

  loadVideoStream({ hass, entityId }: CameraStreamProps) {
    hass
      .sendCommand({
        type: "camera/stream",
        entity_id: entityId,
      })
      .then(({ result: { url } }: CameraStreamCommandResult) => {
        if (this.hls) this.hls.destroy();
        this.hls = new Hls({
          maxBufferLength: 5,
          maxMaxBufferLength: 5,
        });
        this.hls.attachMedia(this.playerRef.current);
        this.hls.on(Hls.Events.MEDIA_ATTACHED, () => {
          this.hls && this.hls.loadSource(hass.buildUrl(url));
        });
        this.hls.on(Hls.Events.MANIFEST_PARSED, () => {
          this.playerRef.current.play();
          this.setState({ videoLoaded: true });
        });
      })
      .catch((err: Error) => {
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
