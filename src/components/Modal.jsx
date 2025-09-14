import React from "react";

function Modal({ open, onClose, children }) {
  if (!open) return null;
  return (
    <div style={{
      position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh",
      background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 999
    }}>
      <div style={{
        background: "#fff", padding: "2rem", borderRadius: "8px", minWidth: "300px", position: "relative"
      }}>
        <button
          style={{ position: "absolute", top: 10, right: 10, fontSize: "1.5rem", background: "none", border: "none", cursor: "pointer" }}
          onClick={onClose}
        >
          &times;
        </button>
        {children}
      </div>
    </div>
  );
}

export default Modal;