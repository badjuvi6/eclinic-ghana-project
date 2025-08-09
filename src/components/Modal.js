import React from 'react';
import './Modal.css';

const Modal = ({ message, onConfirm, onCancel }) => {
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <p>{message}</p>
        <div className="modal-actions">
          {onConfirm && <button onClick={onConfirm} className="confirm-button">Yes</button>}
          {onCancel && <button onClick={onCancel} className="cancel-button">No</button>}
          {!onConfirm && !onCancel && <button onClick={() => {}} className="ok-button">OK</button>}
        </div>
      </div>
    </div>
  );
};

export default Modal;