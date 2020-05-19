import React from "react";
import styled, { css } from "styled-components";

import CameraStream from "./CameraStream";
import Modal, { ModalHeader } from "./Modal";
import TransparentButton from "./TransparentButton";
import { ModalParams } from "../tiles/Tile";

import { DeviceMedia } from "../ui";

// TODO(dcramer): when modal is opened we should force landscape on small screens
// https://stackoverflow.com/questions/27146742/foundation-force-landscape-mode-on-mobile-devices

type CameraViewerContainerProps = {
  sidebar?: boolean;
};

const CameraViewerContainer = styled.div`
  display: grid;
  height: 100%;
  grid-template-rows: 50px auto;

  ${(props: CameraViewerContainerProps) =>
    props.sidebar
      ? css`
          grid-template-columns: 240px auto;
          grid-template-areas:
            "header header"
            "sidebar main";
        `
      : css`
          grid-template-columns: auto;
          grid-template-areas:
            "header"
            "main";
        `}

  @media ${DeviceMedia.MOBILE}, ${DeviceMedia.PORTRAIT} {
    grid-template-areas:
      "header header"
      "main main";
  }
`;

const CameraListContainer = styled.div`
  grid-area: sidebar;
  font-size: 11pt;

  h3 {
    margin: 0;
    padding: 20px;
  }

  ul {
    list-style: none;
    padding: 0;
    margin: 0;
    width: 100%;

    li {
      cursor: pointer;
    }

    li button {
      padding: 20px;
      display: block;
    }

    li.active {
      background: var(--bg-color);
    }
  }

  @media ${DeviceMedia.MOBILE}, ${DeviceMedia.PORTRAIT} {
    display: none;
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

export type CameraModalProps = {
  entityId: string;
  cameraList: string[];
} & ModalParams;

export default ({
  hass,
  entityId,
  cameraList,
  isOpen,
  onRequestClose,
}: CameraModalProps) => {
  const [activeCamera, selectCamera] = React.useState(entityId);
  const activeEntity = hass.getEntity(activeCamera);

  const hasCameraSelection = cameraList.length > 1;

  return (
    <Modal isOpen={isOpen} onRequestClose={onRequestClose} landscapeOnly>
      <CameraViewerContainer sidebar={hasCameraSelection}>
        <ModalHeader
          title={hass.getEntityName(activeEntity)}
          onRequestClose={onRequestClose}
        />
        {hasCameraSelection && (
          <CameraListContainer>
            <h3>Cameras Available</h3>
            <ul>
              {cameraList.map((entityId) => {
                const {
                  attributes: { friendly_name },
                } = hass.getEntity(entityId);
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
        )}
        <CameraStreamContainer>
          <CameraStream
            hass={hass}
            key={activeCamera}
            entityId={activeCamera}
            accessToken={activeEntity.attributes.access_token}
          />
        </CameraStreamContainer>
      </CameraViewerContainer>
    </Modal>
  );
};
// <img src={hass.getEntityPicture(activeCamera)} />
