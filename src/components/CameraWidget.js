import React from "react";

import Widget from "./Widget";

export default class CameraWidget extends Widget {
  getInitialState() {
    return {
      loading: true,
      result: null,
    };
  }

  componentDidMount() {
    this.props.hass
      .sendCommand({
        type: "camera_thumbnail",
        entity_id: this.props.entityId,
      })
      .then((result) => {
        this.setState({
          result,
          loading: false,
        });
      });
  }

  render() {
    const { loading, result } = this.state;
    if (loading) return <div>loading camera</div>;
    return (
      <div>
        <img
          src={`data:${result.content_type};base64,${result.content}`}
          alt={this.props.entityId}
        />
      </div>
    );
  }
}
