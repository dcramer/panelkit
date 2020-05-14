import React from "react";
import Modal from "react-modal";

import "./Modal.css";

export default ({ small, ...props }) => {
  return (
    <Modal
      className={`modal ${small ? "modal-small" : ""}`}
      overlayClassName="overlay"
      {...props}
    />
  );
};
