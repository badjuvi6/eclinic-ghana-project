import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import './Doctordashboard.css';
import Chat from './Chat';

const DoctorDashboard = ({ openChatList, fullName }) => {
  const { logout } = useAuth();
  const [patientList, setPatientList] = useState([]);
  const [selectedChatId, setSelectedChatId] = useState(null);

  useEffect(() => {
    // Logic to fetch patients and messages
  }, []);

  return (
    <div className="dashboard-container">
      <div className="dashboard-content">
        <div className="dashboard-header">
          <h2>Welcome, Dr. {fullName}!</h2>
          <button onClick={openChatList} className="chat-button">Open Chats</button>
        </div>
        <div className="patient-list-container">
          <h3>Your Patients</h3>
          {patientList.length > 0 ? (
            <ul>
              {patientList.map(patient => (
                <li key={patient.id} onClick={() => setSelectedChatId(patient.chatId)}>
                  {patient.fullName}
                </li>
              ))}
            </ul>
          ) : (
            <p>No patients to display.</p>
          )}
        </div>
        {selectedChatId && <Chat chatId={selectedChatId} />}
      </div>
      <button onClick={logout} className="logout-button">Logout</button>
    </div>
  );
};

export default DoctorDashboard;