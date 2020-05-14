import React, { Component } from "react";
import PropTypes from "prop-types";

import "./Tile.css";
import Icon from "../components/Icon";
import { toTitleCase } from "../utils";

const LONG_PRESS_TIME = 1000;

export const TileConfig = Object.freeze({
  title: PropTypes.string,
  subtitle: PropTypes.string,
  entityId: PropTypes.string,
  icon: PropTypes.string,
  icons: PropTypes.objectOf(PropTypes.string),
});

export const TileProps = Object.freeze({
  ...TileConfig,
  hass: PropTypes.object.isRequired,
  cameraList: PropTypes.array.isRequired,
});

export default class Tile extends Component {
  static propTypes = TileProps;

  static defaultIcon;

  constructor(...params) {
    super(...params);
    this.state = this.getInitialState();
    this._activeSubscriptions = [];
    this._clickTimer = null;
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
    if (this._clickTimer) {
      clearTimeout(this._clickTimer);
      this._clickTimer = null;
    }
  }

  handleButtonPress = (e) => {
    e && e.preventDefault();
    if (this.onLongTouch) {
      this._clickTimer = setTimeout(() => {
        this.onLongPress();
        this._clickTimer = null;
      }, LONG_PRESS_TIME);
    }
  };

  handleButtonRelease = (e) => {
    e && e.preventDefault();
    if (this.onLongTouch && this._clickTimer) {
      clearTimeout(this._clickTimer);
      this._clickTimer = null;
      this.onTouch && this.onTouch();
    } else if (!this.onLongTouch) {
      this.onTouch && this.onTouch();
    }
  };

  handleButtonLeave = (e) => {
    e && e.preventDefault();
    if (this._clickTimer) {
      clearTimeout(this._clickTimer);
      this._clickTimer = null;
    }
  };

  onTouch = null;

  onLongTouch = null;

  /* Defines a list of entity IDs to monitor for update.
   *
   * When an entity is updated, it will call `onStateChange`, which
   * by default will simply force the tile to re-render.
   */
  getWatchedEntityIds() {
    if (this.props.entityId) return [this.props.entityId];
    return [];
  }

  getEntity(...params) {
    return this.props.hass.getEntity(...params);
  }

  callService(...params) {
    return this.props.hass.callService(...params);
  }

  onStateChange = (_entityId, _newState) => {
    // XXX(dcramer): Yes, you shouldn't do this. No I don't care about your opinions.
    this.forceUpdate();
  };

  getIcon() {
    if (this.props.entityId) {
      return this.getIconForEntity(this.props.entityId);
    }
    return this.props.icon || this.getDefaultIcon();
  }

  getIconForEntity(entityId) {
    const { state } = this.getEntity(entityId);
    if (this.props.icons && this.props.icons[state])
      return this.props.icons[state];
    return this.props.icon || this.getDefaultIcon();
  }

  /*
   * Return the default icon when no overrides are present.
   */
  getDefaultIcon() {
    return this.constructor.defaultIcon;
  }

  getClassNames() {
    if (!this.props.entityId) return "";
    const { state } = this.getEntity(this.props.entityId);
    return `state-${state}`;
  }

  isTouchable() {
    return this.onTouch || this.onLongTouch;
  }

  render() {
    const isTouchable = this.isTouchable();
    const status = this.renderStatus();
    const title = this.renderTitle();
    const subtitle = this.renderSubtitle();
    const cover = this.renderCover();
    return (
      <div
        className={`tile ${this.getClassNames()} ${isTouchable && "touchable"}`}
        onMouseDown={this.handleButtonPress}
        onMouseUp={this.handleButtonRelease}
        onMouseLeave={this.handleButtonLeave}
        onTouchStart={this.handleButtonPress}
        onTouchEnd={this.handleButtonRelease}
        style={{ cursor: isTouchable ? "pointer" : "normal" }}
      >
        <div className="tile-container">
          {cover && <div className="tile-cover">{cover}</div>}
          {status && <div className="tile-status">{status}</div>}
          <div className="tile-body">{this.renderBody()}</div>
          {title && <div className="tile-title">{title}</div>}
          {subtitle && <div className="tile-subtitle">{subtitle}</div>}
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

  renderSubtitle() {
    return this.props.subtitle;
  }

  renderTitle() {
    if (!this.props.entityId) return null;
    const {
      attributes: { friendly_name },
    } = this.getEntity(this.props.entityId);
    return this.props.title || friendly_name;
  }

  renderStatus() {
    if (!this.props.entityId) return null;
    const { state } = this.getEntity(this.props.entityId);
    return toTitleCase(state);
  }
}
