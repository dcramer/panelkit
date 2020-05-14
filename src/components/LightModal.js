import React from "react";
import styled from "styled-components";
import Slider from "rc-slider";

import "rc-slider/assets/index.css";

import Modal from "./Modal";
import ModalHeader from "./ModalHeader";

// maps to constants in light component
const FEAT_BRIGHTNESS = 1;
const FEAT_COLOR = 2;

const BRIGHTNESS_MIN = 0;
const BRIGHTNESS_MAX = 255;

const LightControllerContainer = styled.div`
  height: 100%;
  padding: 12px;
  background: #dd4c49;
`;

const LightControlsContainer = styled.div`
  margin-top: 32px;

  h6 {
    font-size: 9pt;
    font-weight: 500;
    margin: 0;
    padding: 0 12px;
  }
`;

const BrightnessControlContainer = styled.div`
  padding: 10px 20px 30px;
`;

const BrightnessControl = ({ entityId, brightness, hass }) => {
  return (
    <BrightnessControlContainer>
      <Slider
        defaultValue={brightness}
        min={BRIGHTNESS_MIN}
        max={BRIGHTNESS_MAX}
        onAfterChange={(value) => {
          hass.callService("light", "turn_on", {
            entity_id: entityId,
            brightness: value,
          });
        }}
        trackStyle={{ backgroundColor: "transparent", height: 4 }}
        handleStyle={{
          backgroundColor: "rgba(245, 239, 238, 0.9)",
          border: 0,
          width: "16px",
          height: "16px",
          marginTop: "-6px",
          borderRadius: 0,
        }}
        railStyle={{ backgroundColor: "rgba(245, 239, 238, 0.3)", height: 4 }}
        dotStyle={{ borderRadius: 0, border: 0, width: 0 }}
        activeMarkStyle={{ color: "#fff" }}
        marks={{
          0: {
            label: "Off",
            style: { color: "#fff" },
          },
          63: {
            label: "25%",
            style: { color: "#fff" },
          },
          127: {
            label: "50%",
            style: { color: "#fff" },
          },
          190: {
            label: "75%",
            style: { color: "#fff" },
          },
          255: {
            label: "100%",
            style: { color: "#fff" },
          },
        }}
      />
    </BrightnessControlContainer>
  );
};

export default ({ hass, entityId, isOpen, onRequestClose }) => {
  const entity = hass.getEntity(entityId);
  const { supported_features, brightness } = entity.attributes;
  const supportsBrightness = !!(supported_features & FEAT_BRIGHTNESS);
  const supportsColor = !!(supported_features & FEAT_COLOR);

  const brightnessPercent = parseInt(
    ((brightness || 0) / BRIGHTNESS_MAX) * 100
  );

  return (
    <Modal isOpen={isOpen} onRequestClose={onRequestClose} small>
      <LightControllerContainer>
        <ModalHeader
          title={hass.getEntityName(entity)}
          onRequestClose={onRequestClose}
          small
        />

        <LightControlsContainer>
          {supportsBrightness && (
            <React.Fragment>
              <h6>
                Brightness: {brightnessPercent}% ({brightness || "Off"})
              </h6>
              <BrightnessControl
                hass={hass}
                entityId={entityId}
                brightness={brightness}
              />
            </React.Fragment>
          )}
        </LightControlsContainer>
      </LightControllerContainer>
    </Modal>
  );
};
