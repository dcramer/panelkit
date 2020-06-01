import React, { Component } from "react";
import ReactDOM from "react-dom";
import styled, { css } from "styled-components";
import { orientation } from "o9n";

import Icon from "./Icon";
import TransparentButton from "./TransparentButton";

interface ModalContextInterface {
  ref: any;
}

const ModalContext = React.createContext<ModalContextInterface | null>(null);

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
  private ref: any;

  constructor(props: any) {
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

export type ModalHeaderProps = {
  title: string;
  onRequestClose: () => void;
  small?: boolean;
  light?: boolean;
  children?: JSX.Element | JSX.Element[];
  className?: string;
};

export const UnstyledModalHeader = ({
  children,
  title,
  className,
  onRequestClose,
}: ModalHeaderProps) => {
  return (
    <div className={`${className} modal-header`}>
      <TransparentButton onClick={() => onRequestClose()}>
        <Icon name="close" size={42} />
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

  ${(props: ModalHeaderProps) =>
    props.light &&
    css`
      border: 0;
    `}

  ${(props: ModalHeaderProps) =>
    props.small &&
    css`
      height: 50px;
    `}

  button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 60px;
    height: 100%;
    background: var(--bg-color);

    ${(props: ModalHeaderProps) =>
      props.small &&
      css`
        width: 40px;
        padding: 6px;
      `}

    ${(props: ModalHeaderProps) =>
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
    padding: 0 20px;

    ${(props: ModalHeaderProps) =>
      props.small &&
      css`
        padding: 6px;
      `}
  }
`;

type ModalDialogProps = {
  small?: boolean;
  light?: boolean;
};

export const ModalDialog = styled.div`
  z-index: 100;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: var(--modal-bg-color);

  ${(props: ModalDialogProps) =>
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

export type ModalProps = {
  isOpen: boolean;
  onRequestClose: () => void;
  small?: boolean;
  light?: boolean;
  landscapeOnly?: boolean;
};

type ModalState = {};

export class Modal extends Component<ModalProps, ModalState> {
  // XXX: context may not exist in tests
  static contextType = ModalContext;

  static defaultProps = {
    isOpen: false,
  };

  private overlayRef: any;

  constructor(props: ModalProps, context: any) {
    super(props, context);
    this.overlayRef = React.createRef();
  }

  componentDidMount() {
    if (this.context) {
      ReactDOM.render(this.renderContents(), this.context.ref.current);
    }
    document.addEventListener("keyup", this.onDocumentKeyUp);
    if (this.props.landscapeOnly) {
      orientation.lock("landscape-primary").catch(() => {});
    }
  }

  componentDidUpdate() {
    if (this.context) {
      ReactDOM.render(this.renderContents(), this.context.ref.current);
    }
  }

  componentWillUnmount() {
    if (this.context) {
      ReactDOM.unmountComponentAtNode(this.context.ref.current);
    }
    document.removeEventListener("keyup", this.onDocumentKeyUp);
    orientation.unlock();
  }

  onClickOverlay = (ev: any) => {
    if (ev.target !== this.overlayRef.current) return;
    this.props.onRequestClose && this.props.onRequestClose();
  };

  onDocumentKeyUp = (ev: any) => {
    if (ev.key === "Escape") {
      this.props.onRequestClose && this.props.onRequestClose();
    }
  };

  renderContents() {
    return (
      <React.StrictMode>
        <Overlay
          onClick={this.onClickOverlay}
          ref={this.overlayRef}
          id="overlay"
          style={{
            display: this.props.isOpen ? "block" : "none",
          }}
          data-testid="modal-overlay"
        >
          <ModalDialog small={this.props.small}>
            {this.props.children}
          </ModalDialog>
        </Overlay>
      </React.StrictMode>
    );
  }

  render() {
    return null;
  }
}

export default Modal;
