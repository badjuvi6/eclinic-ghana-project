import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import './Doctordashboard.css';
import Chat from './Chat';
import DoctorAvailability from './DoctorAvailability'; // Import the new component
import { db } from '../firebase';
import { collection, query, where, onSnapshot, doc, getDoc } from 'firebase/firestore';

const DoctorDashboard = ({ openLogoutConfirm, fullName }) => {
  const { currentUser } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loadingAppointments, setLoadingAppointments] = useState(true);
  const [selectedChatId, setSelectedChatId] = useState(null);

  useEffect(() => {
    if (currentUser) {
      const q = query(collection(db, 'appointments'), where('doctorId', '==', currentUser.uid));
      const unsubscribe = onSnapshot(q, async (snapshot) => {
        const appointmentsList = await Promise.all(snapshot.docs.map(async (appointmentDoc) => {
          const appointment = { id: appointmentDoc.id, ...appointmentDoc.data() };
          const patientRef = doc(db, 'users', appointment.patientId);
          const patientSnap = await getDoc(patientRef);
          if (patientSnap.exists()) {
            appointment.patientName = patientSnap.data().fullName || 'Unknown Patient';
          } else {
            appointment.patientName = 'Unknown Patient';
          }
          return appointment;
        }));
        setAppointments(appointmentsList);
        setLoadingAppointments(false);
      });
      return () => unsubscribe();
    }
  }, [currentUser]);

  return (
    <div className="dashboard-container">
      <div className="dashboard-content">
        <div className="dashboard-header">
          <h2>Welcome, Dr. {fullName}!</h2>
        </div>
        <DoctorAvailability /> {/* Render the new component here */}
        <div className="appointments-list-container">
          <h3>Your Upcoming Appointments</h3>
          {loadingAppointments ? (
            <p>Loading appointments...</p>
          ) : appointments.length === 0 ? (
            <p>You have no upcoming appointments.</p>
          ) : (
            <div className="appointments-list">
              {appointments.map(appointment => (
                <div key={appointment.id} className="appointment-card">
                  <p><strong>Patient:</strong> {appointment.patientName}</p>
                  <p><strong>Date:</strong> {appointment.appointmentDate}</p>
                  <p><strong>Time:</strong> {appointment.appointmentTime}</p>
                </div>
              ))}
            </div>
          )}
        </div>
        {selectedChatId && <Chat chatId={selectedChatId} />}
      </div>
      <button onClick={openLogoutConfirm} className="logout-button">Logout</button>
    </div>
  );
};

export default DoctorDashboard;