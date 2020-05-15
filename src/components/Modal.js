import React, { Component } from "react";
import ReactDOM from "react-dom";
import PropTypes from "prop-types";
import styled, { css } from "styled-components";

import Icon from "./Icon";
import TransparentButton from "./TransparentButton";

const ModalContext = React.createContext(null);

export const Overlay = styled.div`
  position: fixed;
  background: rgba(0, 0, 0, 0.7);
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 99;
`;

export class ModalProvider extends Component {
  constructor(props) {
    super(props);
    this.ref = React.createRef();
  }

  render() {
    return (
      <React.Fragment>
        <div ref={this.ref} />
        <ModalContext.Provider value={{ ref: this.ref }}>
          {this.props.children}
        </ModalContext.Provider>
      </React.Fragment>
    );
  }
}

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

export const ModalDialog = styled.div`
  z-index: 100;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;

  background: var(--modal-bg-color);

  ${(props) =>
    props.small &&
    css`
      width: 400px;
      left: 0;
      right: 0;
      top: 50%;
      bottom: auto;
      transform: translateY(-50%);
      margin-left: auto;
      margin-right: auto;
    `}

  &:focus {
    outline: none;
  }
`;

export class Modal extends Component {
  static contextType = ModalContext;

  static propTypes = {
    small: PropTypes.bool,
    light: PropTypes.bool,
  };

  constructor(props) {
    super(props);
    this.overlayRef = React.createRef();
  }

  componentDidMount() {
    ReactDOM.render(
      <Overlay
        onClick={this.onClickOverlay}
        ref={this.overlayRef}
        style={{
          display: this.props.isOpen ? "block" : "none",
        }}
      >
        <ModalDialog onClick={this.onClickModal} small={this.props.small}>
          {this.props.children}
        </ModalDialog>
      </Overlay>,
      this.context.ref.current
    );
  }

  componentWillUnmount() {
    ReactDOM.unmountComponentAtNode(this.context.ref.current);
  }

  onClickOverlay = (e) => {
    if (e.target !== this.overlayRef.current) return;
    this.props.onRequestClose && this.props.onRequestClose();
  };

  render() {
    return null;
  }
}

export default Modal;
