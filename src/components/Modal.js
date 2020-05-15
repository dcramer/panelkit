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
        <Icon name="close" size="42" />
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
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 60px;
    height: 100%;
    background: var(--bg-color);

    ${(props) =>
      props.small &&
      css`
        width: 40px;
        padding: 6px;
      `}

    ${(props) =>
      props.light &&
      css`
        background: inherit;
      `}
  }

  button svg {
    max-width: 100%;
    max-height: 100%;
  }

  h2 {
    display: inline-block;
    margin: 0;
    padding: 20px;

    ${(props) =>
      props.small &&
      css`
        padding: 6px;
      `}
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
