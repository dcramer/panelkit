import React from "react";
import Modal from "react-modal";
import styled from "styled-components";
import Icon from "@mdi/react";
import { mdiClose } from "@mdi/js";

import CameraStream from "./CameraStream";
import ModalHeader from "./ModalHeader";
import TransparentButton from "./TransparentButton";

const CameraViewerContainer = styled.div`
  display: grid;
  height: 100%;
  grid-template-columns: 240px auto;
  grid-template-rows: 60px auto;
  grid-template-areas:
    "header header"
    "sidebar main";
  background-color: #222;
`;

const CameraListContainer = styled.div`
  background: #000;
  grid-area: sidebar;
  padding: 20px;

  ul {
    list-style: none;
    padding: 0;
    margin: 0;

    li {
      cursor: pointer;
    }

    li button {
      padding: 10px 10px;
      display: block;
    }

    li.active {
      background: #222;
    }
  }
`;

const CameraStreamContainer = styled.div`
  grid-area: main;

  video,
  img {
    object-fit: contain;
    width: 100%;
  }
`;

export default ({ hass, entityId, cameraList, isOpen, onRequestClose }) => {
  let [activeCamera, selectCamera] = React.useState(entityId);
  let activeEntity = hass.getState(activeCamera);

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
          <h2>{activeEntity.attributes.friendly_name}</h2>
        </ModalHeader>
        <CameraListContainer>
          <ul>
            {cameraList.map((entityId) => {
              const {
                attributes: { friendly_name },
              } = hass.getState(entityId);
              return (
                <li
                  key={entityId}
                  className={entityId === activeCamera ? "active" : ""}
                >
                  <TransparentButton onClick={() => selectCamera(entityId)}>
                    {friendly_name}
                  </TransparentButton>
                </li>
              );
            })}
          </ul>
        </CameraListContainer>
        <CameraStreamContainer>
          <CameraStream
            hass={hass}
            entityId={activeCamera}
            accessToken={activeEntity.attributes.access_token}
          />
        </CameraStreamContainer>
      </CameraViewerContainer>
    </Modal>
  );
};
// <img src={hass.getEntityPicture(activeCamera)} />
