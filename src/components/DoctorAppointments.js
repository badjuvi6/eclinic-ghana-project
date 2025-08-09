import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, query, where, onSnapshot, doc, getDoc } from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';
import './DoctorAppointments.css';

const DoctorAppointments = () => {
  const { currentUser } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (currentUser) {
      const q = query(collection(db, 'appointments'), where('doctorId', '==', currentUser.uid));
      const unsubscribe = onSnapshot(q, async (snapshot) => {
        const appointmentsList = await Promise.all(snapshot.docs.map(async (appointmentDoc) => {
          const appointment = { id: appointmentDoc.id, ...appointmentDoc.data() };
          // Fetch the patient's full name from the 'users' collection
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
              <p><strong>Patient:</strong> {appointment.patientName}</p>
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