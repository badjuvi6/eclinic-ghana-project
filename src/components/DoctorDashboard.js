import React from 'react';
import DoctorAppointments from './DoctorAppointments';
import DoctorSchedule from './DoctorSchedule';
import { useAuth } from '../contexts/AuthContext';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';
import './Dashboard.css';

function DoctorDashboard({ openChatList, fullName }) {
  const { currentUser } = useAuth();
  const handleLogout = async () => {
    try {
      await signOut(auth);
      alert('Logged out successfully!');
    } catch (err) {
      alert('Failed to log out.');
    }
  };

  return (
    <div className="dashboard-container">
      <div className="user-info">
        <h2>Doctor Dashboard</h2>
        <p>Welcome, Dr. {fullName || currentUser.email}!</p>
        <button onClick={handleLogout} className="logout-button">Logout</button>
        <button onClick={openChatList} className="chat-button">Open Chat</button>
      </div>
      <div className="content">
        <DoctorSchedule />
        <DoctorAppointments />
      </div>
    </div>
  );
}

export default DoctorDashboard;