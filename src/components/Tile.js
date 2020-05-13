import React, { Component } from "react";
import PropTypes from "prop-types";

import Icon from "./Icon";

export const TileProps = Object.freeze({
  hass: PropTypes.object.isRequired,
  name: PropTypes.string,
  entityId: PropTypes.string,
  icon: PropTypes.string,
  icons: PropTypes.objectOf(PropTypes.string),
  cameraList: PropTypes.array.isRequired,
});

const toTitleCase = (str) => {
  return str.replace(
    /\w\S*/g,
    (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
  );
};

export default class Tile extends Component {
  static propTypes = TileProps;

  constructor(...params) {
    super(...params);
    this.state = this.getInitialState();
    this._activeSubscriptions = [];
  }

  getInitialState() {
    return {};
  }

  componentDidMount() {
    this.getWatchedEntityIds().forEach((entityId) => {
      this._activeSubscriptions.push(
        this.props.hass.subscribe(entityId, this.onStateChange)
      );
    });
  }

  componentWillUnmount() {
    this._activeSubscriptions.forEach((sub) => {
      this.props.hass.unsubscribe(...sub);
    });
  }

  /* Defines a list of entity IDs to monitor for update.
   *
   * When an entity is updated, it will call `onStateChange`, which
   * by default will simply force the tile to re-render.
   */
  getWatchedEntityIds() {
    return [];
  }

  getEntity(entityId) {
    return this.props.hass.getState(entityId);
  }

  callService(domain, service, serviceData) {
    return this.props.hass.callService(domain, service, serviceData);
  }

  onStateChange = (_entityId, _newState, _oldState) => {
    // XXX(dcramer): Yes, you shouldn't do this. No I don't care about your opinions.
    this.forceUpdate();
  };

  getIcon() {
    if (this.props.entityId) {
      return this.getIconForEntity(this.props.entityId);
    }
    return this.props.icon;
  }

  getIconForEntity(entityId) {
    const { state } = this.getEntity(entityId);
    if (this.props.icons && this.props.icons[state])
      return this.props.icons[state];
    return this.props.icon;
  }

  onClick = null;

  getClassNames() {
    if (!this.props.entityId) return "";
    const { state } = this.getEntity(this.props.entityId);
    return `state-${state}`;
  }

  render() {
    const status = this.renderStatus();
    const label = this.renderLabel();
    const cover = this.renderCover();
    return (
      <div
        className={`tile ${this.getClassNames()} ${
          this.onClick && "clickable"
        }`}
        onClick={this.onClick}
        style={{ cursor: this.onClick ? "pointer" : "normal" }}
      >
        <div className="tile-container">
          {cover && <div className="tile-cover">{cover}</div>}
          {status && <div className="tile-status">{status}</div>}
          <div className="tile-body">{this.renderBody()}</div>
          {label && <div className="tile-label">{label}</div>}
        </div>
      </div>
    );
  }

  renderBody() {
    const icon = this.getIcon();
    if (!icon) return null;
    return (
      <span className="tile-icon">
        <Icon name={icon} />
      </span>
    );
  }

  renderCover() {}

  renderLabel() {
    if (!this.props.entityId) return null;
    const {
      attributes: { friendly_name },
    } = this.getEntity(this.props.entityId);
    return this.props.name || friendly_name;
  }

  renderStatus() {
    if (!this.props.entityId) return null;
    const { state } = this.getEntity(this.props.entityId);
    return toTitleCase(state);
  }
}
