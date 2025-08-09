import React from 'react';
import './DoctorProfileModal.css';

const DoctorProfileModal = ({ doctor, onBook, onClose }) => {
  if (!doctor) return null;

  return (
    <div className="profile-modal-overlay">
      <div className="profile-modal-content">
        <button onClick={onClose} className="close-profile-button">X</button>
        <h3>Dr. {doctor.fullName}</h3>
        <p><strong>Specialty:</strong> {doctor.specialty || 'General Practitioner'}</p>
        <p><strong>About:</strong> {doctor.bio || 'No bio available.'}</p>
        <button onClick={() => onBook(doctor)} className="book-from-profile-button">Book This Doctor</button>
      </div>
    </div>
  );
};

export default DoctorProfileModal;