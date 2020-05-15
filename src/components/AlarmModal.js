import React from "react";
import styled from "styled-components";

import Icon from "./Icon";
import Modal, { ModalHeader } from "./Modal";
import { toTitleCase } from "../utils";

// maps to constants in alarm_control_panel component
const FEAT_HOME = 1;
const FEAT_AWAY = 2;
const FEAT_NIGHT = 4;

const AlarmControllerContainer = styled.div`
  height: 100%;
  padding: 12px;
  background: #dd4c49;
`;

const AlarmControlsContainer = styled.div`
  margin-top: 10px;
`;

const ControlContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-evenly;
  padding: 0 0 10px;
`;

const Action = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border: 4px solid transparent;
  padding: 10px 20px;

  &:hover,
  &:focus {
    border: 4px solid rgba(255, 255, 255, 0.6);
  }

  h6 {
    margin: 0;
    font-size: 9pt;
    margin-top: 10px;
  }
`;

const setAlarm = (hass, entityId, service) => {
  let state;
  switch (service) {
    case "alarm_arm_home":
      state = "armed_home";
      break;
    case "alarm_arm_away":
      state = "armed_away";
      break;
    case "alarm_arm_night":
      state = "armed_night";
      break;
    default:
  }
  hass.callService(
    "alarm_control_panel",
    service,
    {
      entity_id: entityId,
    },
    {
      [entityId]: {
        state,
      },
    }
  );
};

const AlarmStateControl = ({ entityId, state, supportedFeatures, hass }) => {
  return (
    <ControlContainer>
      {!!(supportedFeatures & FEAT_HOME) && (
        <Action onClick={() => setAlarm(hass, entityId, "alarm_arm_home")}>
          <Icon name="bell" />
          <h6>Arm Home</h6>
        </Action>
      )}
      {!!(supportedFeatures & FEAT_AWAY) && (
        <Action onClick={() => setAlarm(hass, entityId, "alarm_arm_away")}>
          <Icon name="bell" />
          <h6>Arm Away</h6>
        </Action>
      )}

      {!!(supportedFeatures & FEAT_NIGHT) && (
        <Action onClick={() => setAlarm(hass, entityId, "alarm_arm_night")}>
          <Icon name="bell" />
          <h6>Arm Night</h6>
        </Action>
      )}
    </ControlContainer>
  );
};
//

export default ({ hass, entityId, isOpen, onRequestClose }) => {
  const entity = hass.getEntity(entityId);
  const { brightness, supported_features } = entity.attributes;

  return (
    <Modal isOpen={isOpen} onRequestClose={onRequestClose} small>
      <AlarmControllerContainer>
        <ModalHeader
          title={toTitleCase(entity.state)}
          onRequestClose={onRequestClose}
          small
          light
        />

        <AlarmControlsContainer>
          <AlarmStateControl
            hass={hass}
            entityId={entityId}
            supportedFeatures={supported_features}
            brightness={brightness}
          />
        </AlarmControlsContainer>
      </AlarmControllerContainer>
    </Modal>
  );
};
