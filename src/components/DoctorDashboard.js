import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import './Doctordashboard.css';
import Chat from './Chat';
import DoctorCalendar from './DoctorCalendar'; 
import DoctorProfile from './DoctorProfile';
import { db } from '../firebase';
import { collection, query, where, onSnapshot, doc, getDoc, updateDoc, addDoc } from 'firebase/firestore';

const DoctorDashboard = ({ openLogoutConfirm, fullName }) => {
  const { currentUser } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [pendingAppointments, setPendingAppointments] = useState([]);
  const [loadingAppointments, setLoadingAppointments] = useState(true);
  const [selectedChatId, setSelectedChatId] = useState(null);

  useEffect(() => {
    if (currentUser) {
      const q = query(collection(db, 'appointments'), where('doctorId', '==', currentUser.uid));
      const unsubscribe = onSnapshot(q, async (snapshot) => {
        const allAppointmentsList = await Promise.all(snapshot.docs.map(async (appointmentDoc) => {
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
        
        const pending = allAppointmentsList.filter(app => app.status === 'Pending');
        const upcoming = allAppointmentsList.filter(app => app.status === 'Accepted');

        setPendingAppointments(pending);
        setAppointments(upcoming);
        setLoadingAppointments(false);
      });
      return () => unsubscribe();
    }
  }, [currentUser]);

  const handleAppointmentAction = async (appointmentId, status) => {
    try {
      const appointmentRef = doc(db, 'appointments', appointmentId);
      await updateDoc(appointmentRef, { status });

      if (status === 'Accepted') {
        const appointmentSnap = await getDoc(appointmentRef);
        const { patientId, doctorId } = appointmentSnap.data();

        await addDoc(collection(db, 'chats'), {
          participants: [patientId, doctorId],
          createdAt: new Date(),
        });
      }
    } catch (error) {
      console.error(`Error updating appointment status to ${status}: `, error);
    }
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-content">
        <div className="dashboard-header">
          <h2>Welcome, Dr. {fullName}!</h2>
        </div>
        <DoctorProfile />
        <DoctorCalendar />
        
        <div className="appointments-list-container">
          <h3>Pending Appointment Requests</h3>
          {loadingAppointments ? (
            <p>Loading pending appointments...</p>
          ) : pendingAppointments.length === 0 ? (
            <p>You have no pending appointment requests.</p>
          ) : (
            <div className="appointments-list">
              {pendingAppointments.map(appointment => (
                <div key={appointment.id} className="appointment-card">
                  <p><strong>Patient:</strong> {appointment.patientName}</p>
                  <p><strong>Date:</strong> {appointment.appointmentDate}</p>
                  <p><strong>Time:</strong> {appointment.appointmentTime}</p>
                  <div className="appointment-actions">
                    <button 
                      className="accept-button" 
                      onClick={() => handleAppointmentAction(appointment.id, 'Accepted')}
                    >
                      Accept
                    </button>
                    <button 
                      className="decline-button" 
                      onClick={() => handleAppointmentAction(appointment.id, 'Declined')}
                    >
                      Decline
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="appointments-list-container">
          <h3>Your Upcoming Appointments</h3>
          {loadingAppointments ? (
            <p>Loading upcoming appointments...</p>
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