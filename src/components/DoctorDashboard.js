import React, { useState } from 'react';
import DoctorAppointments from './DoctorAppointments';
import DoctorProfile from './DoctorProfile';
import './Dashboard.css';

const DoctorDashboard = () => {
  const [showProfile, setShowProfile] = useState(false);

  return (
    <div className="dashboard-container">
      <div className="dashboard-content">
        <div className="dashboard-actions">
          <button onClick={() => setShowProfile(true)} className="edit-profile-button">
            Edit Profile
          </button>
        </div>
        {showProfile ? (
          <DoctorProfile onClose={() => setShowProfile(false)} />
        ) : (
          <DoctorAppointments />
        )}
      </div>
    </div>
  );
};

export default DoctorDashboard;