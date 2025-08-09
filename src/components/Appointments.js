import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, query, where, onSnapshot, doc, getDoc, deleteDoc } from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';
import './Appointments.css';

const Appointments = ({ openBookingModal }) => {
  const { currentUser } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (currentUser) {
      const q = query(collection(db, 'appointments'), where('patientId', '==', currentUser.uid));
      const unsubscribe = onSnapshot(q, async (snapshot) => {
        const appointmentsList = await Promise.all(snapshot.docs.map(async (appointmentDoc) => {
          const appointment = { id: appointmentDoc.id, ...appointmentDoc.data() };
          // Fetch the doctor's full name from the 'users' collection
          const doctorRef = doc(db, 'users', appointment.doctorId);
          const doctorSnap = await getDoc(doctorRef);
          if (doctorSnap.exists()) {
            appointment.doctorName = doctorSnap.data().fullName || doctorSnap.data().email;
          } else {
            appointment.doctorName = 'Unknown Doctor';
          }
          return appointment;
        }));
        setAppointments(appointmentsList);
        setLoading(false);
      });
      return () => unsubscribe();
    }
  }, [currentUser]);

  const handleDelete = async (appointmentId) => {
    try {
      const confirmed = window.confirm("Are you sure you want to cancel this appointment?");
      if (confirmed) {
        await deleteDoc(doc(db, "appointments", appointmentId));
        alert('Appointment cancelled successfully.');
      }
    } catch (err) {
      console.error("Error removing appointment: ", err);
      alert('Failed to cancel appointment.');
    }
  };

  if (loading) {
    return <div>Loading appointments...</div>;
  }

  return (
    <div className="appointments-container">
      <h3>Your Appointments</h3>
      <button onClick={openBookingModal} className="book-appointment-button">Book a New Appointment</button>
      {appointments.length === 0 ? (
        <p>You have no appointments booked yet.</p>
      ) : (
        <div className="appointments-list">
          {appointments.map(appointment => (
            <div key={appointment.id} className="appointment-card">
              <p><strong>Doctor:</strong> {appointment.doctorName}</p>
              <p><strong>Date:</strong> {appointment.appointmentDate}</p>
              <p><strong>Time:</strong> {appointment.appointmentTime}</p>
              <button 
                onClick={() => handleDelete(appointment.id)} 
                className="delete-button"
              >
                Cancel
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Appointments;