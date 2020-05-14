import React from "react";

import styled, { css } from "styled-components";

import Icon from "./Icon";
import TransparentButton from "./TransparentButton";

const ModalHeader = ({ children, title, className, onRequestClose }) => {
  return (
    <div className={`${className}`}>
      <TransparentButton onClick={onRequestClose}>
        <Icon name="close" size="24" />
      </TransparentButton>
      {title && <h2>{title}</h2>}
      {children}
    </div>
  );
};

export default styled(ModalHeader)`
  grid-area: header;
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  padding: 20px 20px 0 20px;

  ${(props) =>
    props.small &&
    css`
      padding: 6px 6px 0 6px;
      margin-bottom: 6px;
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
