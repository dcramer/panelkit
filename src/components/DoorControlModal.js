import React from "react";
import Modal from "react-modal";
import styled from "styled-components";
import Icon from "@mdi/react";
import { mdiClose } from "@mdi/js";

import CameraStream from "./CameraStream";
import ModalHeader from "./ModalHeader";
import TransparentButton from "./TransparentButton";

const CameraViewerContainer = styled.div`
  height: 100%;
  background-color: #222;
`;
const ControlsContainer = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  padding: 20px;
`;

const CameraStreamContainer = styled.div`
  video,
  img {
    object-fit: contain;
    max-height: 100%;
    max-width: 100%;
  }
`;

export default ({ hass, camera, name, isOpen, onRequestClose }) => {
  let cameraEntity = hass.getState(camera);

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      className="Modal"
      overlayClassName="Overlay"
    >
      <CameraViewerContainer>
        <ModalHeader>
          <TransparentButton onClick={onRequestClose}>
            <Icon path={mdiClose} />
          </TransparentButton>
          <h2>{name}</h2>
        </ModalHeader>
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
