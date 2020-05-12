import React from "react";
import Modal from "react-modal";
import styled from "styled-components";
import Icon from "@mdi/react";
import { mdiClose } from "@mdi/js";

const CameraViewer = styled.div`
  display: grid;
  height: 100%;
  grid-template-columns: 240px auto;
  grid-template-rows: 60px auto;
  grid-template-areas:
    "header header"
    "sidebar main";
  background-color: #222;
`;

const ModalHeader = styled.div`
  grid-area: header;
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  padding: 20px 20px 0 20px;

  button {
    display: inline-block;
    width: 32px;
    height: 32px;
    margin-right: 20px;
  }

  button svg {
    max-width: 100%;
    max-height: 100%;
  }

  h2 {
    display: inline-block;
    margin: 0;
  }
`;

const CameraList = styled.div`
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

const CameraStream = styled.div`
  grid-area: main;

  video,
  img {
    object-fit: contain;
    width: 100%;
  }
`;

const TransparentButton = styled.button`
  background: inherit;
  color: inherit;
  border: 0;
  padding: 0;
  margin: 0;
  font-size: inherit;
  display: inline;
  outline: none;
  cursor: pointer;
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
      <CameraViewer>
        <ModalHeader>
          <TransparentButton onClick={onRequestClose}>
            <Icon path={mdiClose} />
          </TransparentButton>
          <h2>{activeEntity.attributes.friendly_name}</h2>
        </ModalHeader>
        <CameraList>
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
        </CameraList>
        <CameraStream>
          <img
            src={hass.buildUrl(
              `/api/camera_proxy_stream/${activeCamera}?token=${activeEntity.attributes.access_token}`
            )}
            key={activeCamera}
            alt="stream"
          />
        </CameraStream>
      </CameraViewer>
    </Modal>
  );
};
// <img src={hass.getEntityPicture(activeCamera)} />
