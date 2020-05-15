import React, { Component } from "react";
import PropTypes from "prop-types";
import { toast } from "react-toastify";

import "./Tile.css";
import Icon from "../components/Icon";
import { toTitleCase } from "../utils";

const LONG_PRESS_TIME = 300;

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
    this.state = {
      modalIsOpen: false,
      ...this.getInitialState(),
    };
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

  handleMouseDown = (e) => {
    e.preventDefault();
    if ((e.button === 0 && e.ctrlKey) || e.button > 0) return;
    return this.handleButtonPress();
  };

  handleTouchStart = (e) => {
    e.preventDefault();
    if (e.touches.length > 1) return;
    if ((e.button === 0 && e.ctrlKey) || e.button > 0) return;
    return this.handleButtonPress();
  };

  handleTouchMove = (e) => {
    // We handle the touch move event to avoid a "long press" event from being
    // fired after someone touchhes and attempts to scroll
    if (this._clickTimer) {
      clearTimeout(this._clickTimer);
      this._clickTimer = null;
    }
  };

  handleButtonPress = (e) => {
    // TODO(dcramer): i cant understand why onClick is firing outsie of the element scope
    if (this.state.modalIsOpen) return;
    // if we've got a long press handler define, start our countdown, which will get
    // interrupted on press/mouse release
    if (this.onLongTouch) {
      this._clickTimer = setTimeout(() => {
        this.onLongTouch();
        this._clickTimer = null;
      }, LONG_PRESS_TIME);
    }
  };

  handleButtonRelease = (e) => {
    if (this.state.modalIsOpen) return;
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

  callService(domain, service, ...params) {
    return this.props.hass
      .callService(domain, service, ...params)
      .catch((err) => {
        toast.error(
          `Error occured when calling ${domain}.${service}: ${err.message}`
        );
      });
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

  openModal = () => {
    if (this.state.modalIsOpen) return;
    this.setState({ modalIsOpen: true });
  };

  closeModal = () => {
    this.setState({ modalIsOpen: false });
  };

  render() {
    const isTouchable = this.isTouchable();
    const status = this.renderStatus();
    const title = this.renderTitle();
    const subtitle = this.renderSubtitle();
    const cover = this.renderCover();
    return (
      <div
        className={`tile ${this.getClassNames()} ${isTouchable && "touchable"}`}
        onMouseDown={this.handleMouseDown}
        onMouseUp={this.handleButtonRelease}
        onMouseLeave={this.handleButtonLeave}
        onTouchStart={this.handleTouchStart}
        onTouchEnd={this.handleButtonRelease}
        onTouchMove={this.handleTouchMove}
        style={{ cursor: isTouchable ? "pointer" : "normal" }}
      >
        <div className="tile-container">
          {cover && <div className="tile-cover">{cover}</div>}
          {status && <div className="tile-status">{status}</div>}
          <div className="tile-body">{this.renderBody()}</div>
          {title && <div className="tile-title">{title}</div>}
          {subtitle && <div className="tile-subtitle">{subtitle}</div>}
          {this.state.modalIsOpen &&
            this.renderModal({
              hass: this.props.hass,
              entityId: this.props.entityId,
              isOpen: this.state.modalIsOpen,
              onRequestClose: this.closeModal,
              cameraList: this.props.cameraList,
            })}
        </div>
      </div>
    );
  }

  renderModal() {}

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
