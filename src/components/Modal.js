import React from "react";
import Modal from "react-modal";
import styled, { css } from "styled-components";

import Icon from "./Icon";
import TransparentButton from "./TransparentButton";

import "./Modal.css";

export const UnstyledModalHeader = ({
  children,
  title,
  className,
  onRequestClose,
}) => {
  return (
    <div className={`${className} modal-header`}>
      <TransparentButton onClick={onRequestClose}>
        <Icon name="close" size="24" />
      </TransparentButton>
      {title && <h2>{title}</h2>}
      {children}
    </div>
  );
};

export const ModalHeader = styled(UnstyledModalHeader)`
  grid-area: header;
  display: flex;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid var(--bg-color);

  ${(props) =>
    props.light &&
    css`
      border: 0;
    `}

  ${(props) =>
    props.small &&
    css`
      padding: 6px;
    `}

  button {
    display: inline-block;
    width: 24px;
    height: 24px;
    margin-right: 10px;
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

export default ({ small, ...props }) => {
  return (
    <Modal
      className={`modal ${small ? "modal-small" : ""}`}
      overlayClassName="overlay"
      {...props}
    />
  );
};
