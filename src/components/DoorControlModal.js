import React from "react";
import styled from "styled-components";

import CameraStream from "./CameraStream";
import Modal, { ModalHeader } from "./Modal";

const CameraViewerContainer = styled.div`
  display: grid;
  height: 100%;
  grid-template-columns: 100%;
  grid-template-rows: 60px auto;
  grid-template-areas:
    "header header"
    "sidebar main";
`;
const ControlsContainer = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  top: 60px;
  bottom: 0;
  width: 100%;
`;

const CameraStreamContainer = styled.div`
  video,
  img {
    object-fit: contain;
    max-height: 100%;
    max-width: 100%;
  }
`;

export default ({ hass, camera, title, isOpen, onRequestClose }) => {
  let cameraEntity = hass.getEntity(camera);

  return (
    <Modal isOpen={isOpen} onRequestClose={onRequestClose}>
      <CameraViewerContainer>
        <ModalHeader title={title} onRequestClose={onRequestClose} />
        <ControlsContainer></ControlsContainer>
        <CameraStreamContainer>
          <CameraStream
            hass={hass}
            entityId={camera}
            accessToken={cameraEntity.attributes.access_token}
          />
        </CameraStreamContainer>
      </CameraViewerContainer>
    </Modal>
  );
};
