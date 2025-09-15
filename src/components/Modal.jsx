import React from "react";

function Modal({ open, onClose, children }) {
  if (!open) return null;
  return (
    <div className="modal">
      <div className="modal__container">
        <button className="modal__close" onClick={onClose}>
          &times;
        </button>
        {children}
      </div>
    </div>
  );
}

export default Modal;
