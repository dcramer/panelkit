import React, { Component } from "react";
import { toast } from "react-toastify";

import "./Tile.css";
import LoadingIndicator from "../components/LoadingIndicator";
import Icon from "../components/Icon";
import { toTitleCase } from "../utils";

import HomeAssistant from "../hass";
import { Entity, TileComponentConfig } from "../types";

const LONG_PRESS_TIME = 1000;

export interface TileProps extends TileComponentConfig {
  hass: HomeAssistant;
  cameraList: string[];
}

export interface TileState {
  modalIsOpen: boolean;
  isLoading: boolean;
}

export type ModalParams = {
  entityId?: string;
  hass: HomeAssistant;
  callService: Function;
  cameraList: string[];
  isOpen: boolean;
  onRequestClose: () => void;
};

export default class Tile<
  T extends TileProps = TileProps,
  S extends TileState = TileState
> extends Component<T, S> {
  public static defaultIcon: string;

  private _activeSubscriptions: string[];
  private _longPressTimer: number | null;
  private _wasScrolling: boolean;

  state: S;

  constructor(props: T, context?: any) {
    super(props, context);
    this._activeSubscriptions = [];
    this._longPressTimer = null;
    this._wasScrolling = false;

    this.callService = this.callService.bind(this);

    this.state = this.getInitialState();
  }

  getInitialState(): any {
    return { modalIsOpen: false, isLoading: false };
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
      this.props.hass.unsubscribe(sub);
    });
    if (this._longPressTimer) {
      clearTimeout(this._longPressTimer);
      this._longPressTimer = null;
    }
  }

  handleMouseDown = (e: React.MouseEvent<HTMLElement>) => {
    if ((e.button === 0 && e.ctrlKey) || e.button > 0) {
      console.debug("[panelkit] Ignoring click due to mouse button(s)");
      return;
    }
    return this.handleButtonPress(e);
  };

  handleTouchStart = (e: React.TouchEvent<HTMLElement>) => {
    if (e.touches.length > 1) return;
    return this.handleButtonPress(e);
  };

  handleTouchMove = (e: any) => {
    // We handle the touch move event to avoid a "long press" event from being
    // fired after someone touchhes and attempts to scroll
    if (this._longPressTimer) {
      clearTimeout(this._longPressTimer);
      this._longPressTimer = null;
    }
    this._wasScrolling = true;
  };

  handleButtonPress = (e: any) => {
    if (this.onLongTouch) {
      this._longPressTimer = setTimeout(() => {
        this.onLongTouch && this.onLongTouch();
        this._longPressTimer = null;
      }, LONG_PRESS_TIME);
    }
  };

  handleButtonRelease = (
    e: React.TouchEvent<HTMLElement> | React.MouseEvent<HTMLElement>
  ) => {
    e.cancelable && e.preventDefault();
    if (this._wasScrolling) {
      console.debug("[panelkit] Ignoring click due to scrolling");
      this._wasScrolling = false;
      return;
    }
    if (this.onLongTouch && this._longPressTimer) {
      clearTimeout(this._longPressTimer);
      this._longPressTimer = null;
      this.onTouch && this.onTouch();
    } else if (!this.onLongTouch && this.onTouch) {
      this.onTouch();
    }
  };

  handleButtonLeave = (
    e: React.TouchEvent<HTMLElement> | React.MouseEvent<HTMLElement>
  ) => {
    if (this._longPressTimer) {
      clearTimeout(this._longPressTimer);
      this._longPressTimer = null;
    }
  };

  onTouch: (() => void) | null = null;

  onLongTouch: (() => void) | null = null;

  /* Defines a list of entity IDs to monitor for update.
   *
   * When an entity is updated, it will call `onStateChange`, which
   * by default will simply force the tile to re-render.
   */
  getWatchedEntityIds(): string[] {
    const { entityId } = this.props;
    if (entityId) return [entityId as string];
    return [];
  }

  getEntity(entityId: string): Entity {
    return this.props.hass.getEntity(entityId);
  }

  callService(
    domain: string,
    service: string,
    serviceData: any,
    suggestedChanges?: any
  ) {
    this.setState({ isLoading: true });

    return this.props.hass
      .callService(domain, service, serviceData, suggestedChanges)
      .catch((err: Error) => {
        toast.error(
          `Error occured when calling ${domain}.${service}: ${err.message}`
        );
        this.setState({ isLoading: false });
      });
  }

  onStateChange = (entityId: string, newState: Entity) => {
    // XXX(dcramer): Yes, you shouldn't do this. No I don't care about your opinions.
    this.setState({ isLoading: false });
  };

  getIcon(): string {
    const { entityId, icon } = this.props;
    if (entityId) return this.getIconForEntity(entityId as string);
    if (icon) return icon as string;
    return this.getDefaultIcon();
  }

  getIconForEntity(entityId: string): string {
    const { state } = this.getEntity(entityId);
    if (this.props.icons && this.props.icons[state])
      return this.props.icons[state] as string;
    if (this.props.icon) return this.props.icon as string;
    return this.getDefaultIcon();
  }

  /*
   * Return the default icon when no overrides are present.
   */
  getDefaultIcon(): string {
    return (this.constructor as typeof Tile).defaultIcon;
  }

  getClassNames(): string {
    const { entityId } = this.props;
    if (!entityId) return "";
    const { state } = this.getEntity(entityId as string);
    return `state-${state}`;
  }

  isTouchable(): boolean {
    return !!(this.onTouch || this.onLongTouch);
  }

  openModal = () => {
    if (this.state.modalIsOpen) return;
    this.setState({ modalIsOpen: true });
  };

  closeModal = () => {
    this.setState({ modalIsOpen: false });
  };

  render() {
    const { isLoading } = this.state;
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
        data-testid="tile"
      >
        <div className="tile-container">
          {cover && <div className="tile-cover">{cover}</div>}
          {status && <div className="tile-status">{status}</div>}
          <div className="tile-body">{this.renderBody()}</div>
          {title && <div className="tile-title">{title}</div>}
          {subtitle && <div className="tile-subtitle">{subtitle}</div>}
          {isLoading && (
            <div className="tile-loading">
              <LoadingIndicator />
            </div>
          )}
          {this.state.modalIsOpen &&
            this.renderModal({
              hass: this.props.hass,
              entityId: this.props.entityId,
              isOpen: this.state.modalIsOpen,
              onRequestClose: this.closeModal,
              cameraList: this.props.cameraList,
              callService: this.callService,
            })}
        </div>
      </div>
    );
  }

  renderModal(params: ModalParams) {}

  renderBody() {
    const icon = this.getIcon();
    if (!icon) return null;
    return (
      <span className="tile-icon">
        <Icon name={icon as string} />
      </span>
    );
  }

  renderCover(): any | null {}

  renderSubtitle(): string | null {
    const { subtitle } = this.props;
    if (!subtitle) return null;
    return subtitle as string;
  }

  renderTitle(): any | null {
    const { entityId } = this.props;
    if (!entityId) return null;
    const {
      attributes: { friendly_name },
    } = this.getEntity(entityId as string);
    return this.props.title || friendly_name || "";
  }

  renderStatus(): any | null {
    const { entityId } = this.props;
    if (!entityId) return null;
    const { state } = this.getEntity(entityId as string);
    return toTitleCase(state);
  }
}
