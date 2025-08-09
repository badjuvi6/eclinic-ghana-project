import React from 'react';
import './SuccessModal.css';

const SuccessModal = ({ message, onClose }) => {
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <p>{message}</p>
        <div className="modal-actions">
          <button onClick={onClose} className="ok-button">OK</button>
        </div>
      </div>
    </div>
  );
};

export default SuccessModal;