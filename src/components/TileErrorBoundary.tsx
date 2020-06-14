import React, { Component } from "react";

export default class TileErrorBoundary extends Component {
  readonly state: {
    error: Error | ErrorEvent | null;
  } = {
    error: null,
  };

  componentDidCatch(error: ErrorEvent | Error) {
    this.setState({ error });
  }

  render() {
    if (this.state.error)
      return (
        <div>
          <h3>Tile Error</h3>
          {this.state.error.message}
        </div>
      );
    return this.props.children;
  }
}
