import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';
import './DoctorAppointments.css';

const DoctorAppointments = () => {
  const { currentUser } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (currentUser) {
      const q = query(collection(db, 'appointments'), where('doctorId', '==', currentUser.uid));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const appointmentsList = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setAppointments(appointmentsList);
        setLoading(false);
      });
      return () => unsubscribe();
    }
  }, [currentUser]);

  if (loading) {
    return <div>Loading appointments...</div>;
  }

  return (
    <div className="doctor-appointments-container">
      <h3>Your Upcoming Appointments</h3>
      {appointments.length === 0 ? (
        <p>You have no upcoming appointments.</p>
      ) : (
        <div className="appointments-list">
          {appointments.map(appointment => (
            <div key={appointment.id} className="appointment-card">
              <p><strong>Patient:</strong> {appointment.patientEmail}</p>
              <p><strong>Date:</strong> {appointment.appointmentDate}</p>
              <p><strong>Time:</strong> {appointment.appointmentTime}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DoctorAppointments;