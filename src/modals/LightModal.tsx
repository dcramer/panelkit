import React from "react";
import styled from "styled-components";
import Slider from "rc-slider";

import "rc-slider/assets/index.css";

import Modal, { ModalHeader } from "./Modal";
import HomeAssistant from "../hass";
import { EntityAttributes } from "../types";
import { ModalParams } from "../tiles/Tile";

// maps to constants in light component
const FEAT_BRIGHTNESS = 1;
// const FEAT_COLOR = 2;

const BRIGHTNESS_MIN = 0;
const BRIGHTNESS_MAX = 255;

const LightControllerContainer = styled.div`
  height: 100%;
  padding: 12px;
  background: #dd4c49;
`;

const LightControlsContainer = styled.div`
  margin-top: 20px;

  h6 {
    font-size: 9pt;
    font-weight: 500;
    margin: 0;
    padding: 0 12px;
  }
`;

const BrightnessControlContainer = styled.div`
  padding: 10px 20px 35px;
`;

type BrightnessControlProps = {
  entityId: string;
  brightness: number;
  hass: HomeAssistant;
};

const BrightnessControl = ({
  entityId,
  brightness,
  hass,
}: BrightnessControlProps) => {
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
        marks={{
          0: {
            label: "Off",
            style: { color: "#fff", marginTop: 5 },
          },
          63: {
            label: "25%",
            style: { color: "#fff", marginTop: 5 },
          },
          127: {
            label: "50%",
            style: { color: "#fff", marginTop: 5 },
          },
          190: {
            label: "75%",
            style: { color: "#fff", marginTop: 5 },
          },
          255: {
            label: "100%",
            style: { color: "#fff", marginTop: 5 },
          },
        }}
      />
    </BrightnessControlContainer>
  );
};

export type LightModalProps = {
  entityId: string;
} & ModalParams;

type LightAttributes = {
  supported_features: number;
  brightness?: number;
} & EntityAttributes;

export default ({
  hass,
  entityId,
  isOpen,
  onRequestClose,
}: LightModalProps) => {
  const entity = hass.getEntity(entityId);
  const {
    supported_features,
    brightness,
  } = entity.attributes as LightAttributes;
  const supportsBrightness = !!(supported_features & FEAT_BRIGHTNESS);
  // const supportsColor = !!(supported_features & FEAT_COLOR);

  const brightnessPercent = Math.floor(
    ((brightness || 0) / BRIGHTNESS_MAX) * 100
  );

  return (
    <Modal isOpen={isOpen} onRequestClose={onRequestClose} small>
      <LightControllerContainer>
        <ModalHeader
          title={hass.getEntityName(entity)}
          onRequestClose={onRequestClose}
          small
          light
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
                brightness={brightness || 0}
              />
            </React.Fragment>
          )}
        </LightControlsContainer>
      </LightControllerContainer>
    </Modal>
  );
};
