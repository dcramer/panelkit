import React from "react";
import styled from "styled-components";

import CameraStream from "./CameraStream";
import Modal from "./Modal";
import ModalHeader from "./ModalHeader";

const CameraViewerContainer = styled.div`
  height: 100%;
`;
const ControlsContainer = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  top: 80px;
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
