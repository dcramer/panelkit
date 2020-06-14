import React, { Component } from "react";
import HomeAssistant from "../hass";
import { Entity, EventConfig } from "../types";

interface Props {
  hass: HomeAssistant;
  events: EventConfig[];
}

export interface State {
  activeEvent: number | null;
}

export default class EventManager extends Component<Props, State> {
  private _activeSubscriptions: string[] = [];

  readonly state: State = {
    activeEvent: null,
  };

  componentDidMount() {
    this.props.events.forEach(({ entityId }) => {
      this._activeSubscriptions.push(
        this.props.hass.subscribe(entityId, this.onStateChange)
      );
    });
  }

  componentWillUnmount() {
    this._activeSubscriptions.forEach((sub) => {
      this.props.hass.unsubscribe(sub);
    });
  }

  onStateChange = (entityId: string, newState: Entity) => {
    const matchingConfig = this.props.events.find((eventConfig, idx) => {
      if (eventConfig.entityId !== entityId) return false;
      if (this.state.activeEvent && this.state.activeEvent !== idx)
        return false;
      return true;
    });
    if (!matchingConfig) return;
    if (this.state.activeEvent !== null) {
      // event is active, should it become inactive?
      if (newState.state !== matchingConfig.state) {
        this.setState({ activeEvent: null });
      }
    } else if (newState.state === matchingConfig.state) {
      this.setState({ activeEvent: this.props.events.indexOf(matchingConfig) });
    }
  };

  render() {
    if (this.state.activeEvent === null) {
      return null;
    }
    const eventConfig = this.props.events[this.state.activeEvent];
    const ModalComponent = eventConfig.modal.type;
    return (
      <ModalComponent
        hass={this.props.hass}
        entityId={eventConfig.entityId}
        isOpen
        cameraList={[]}
        callService={this.props.hass.callService}
        {...eventConfig.modal}
      />
    );
  }
}
