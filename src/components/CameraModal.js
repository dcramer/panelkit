import React from "react";
import Modal from "react-modal";
import styled from "styled-components";
import Icon from "@mdi/react";
import { mdiClose } from "@mdi/js";

const CameraViewer = styled.div`
  display: grid;
  height: 100%;
  grid-template-columns: 240px auto;
  grid-template-rows: minmax(60px, 80px) auto;
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

  a {
    display: inline-block;
    width: 32px;
    height: 32px;
    margin-right: 20px;
  }

  a svg {
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
      padding: 10px 10px;
      cursor: pointer;
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

export default ({ hass, entityId, cameraList, isOpen, onRequestClose }) => {
  let [activeCamera, selectCamera] = React.useState(entityId);
  let activeEntity = cameraList.find((e) => e.entity_id === activeCamera);

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      className="Modal"
      overlayClassName="Overlay"
    >
      <CameraViewer>
        <ModalHeader>
          <a onClick={onRequestClose} href>
            <Icon path={mdiClose} />
          </a>
          <h2>{activeEntity.attributes.friendly_name}</h2>
        </ModalHeader>
        <CameraList>
          <ul>
            {cameraList.map((entity) => {
              return (
                <li
                  key={entity.entity_id}
                  className={entity.entity_id === activeCamera && "active"}
                >
                  <a onClick={() => selectCamera(entity.entity_id)} href>
                    {entity.attributes.friendly_name}
                  </a>
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
