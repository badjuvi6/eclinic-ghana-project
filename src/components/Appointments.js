import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, query, where, onSnapshot, doc, getDoc, deleteDoc } from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';
import ConfirmationModal from './ConfirmationModal';
import SuccessModal from './SuccessModal';
import './Appointments.css';

const Appointments = ({ openBookingModal }) => {
  const { currentUser } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [appointmentToDelete, setAppointmentToDelete] = useState(null);

  useEffect(() => {
    if (currentUser) {
      const q = query(collection(db, 'appointments'), where('patientId', '==', currentUser.uid));
      const unsubscribe = onSnapshot(q, async (snapshot) => {
        const appointmentsList = await Promise.all(snapshot.docs.map(async (appointmentDoc) => {
          const appointment = { id: appointmentDoc.id, ...appointmentDoc.data() };
          const doctorRef = doc(db, 'users', appointment.doctorId);
          const doctorSnap = await getDoc(doctorRef);
          if (doctorSnap.exists()) {
            appointment.doctorName = doctorSnap.data().fullName || 'Unknown Doctor';
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

  const confirmDelete = (appointmentId) => {
    setAppointmentToDelete(appointmentId);
    setShowConfirmModal(true);
  };

  const handleDelete = async () => {
    try {
      if (appointmentToDelete) {
        await deleteDoc(doc(db, "appointments", appointmentToDelete));
        setShowSuccessModal(true);
      }
    } catch (err) {
      console.error("Error removing appointment: ", err);
      alert('Failed to cancel appointment.');
    } finally {
      setShowConfirmModal(false);
      setAppointmentToDelete(null);
    }
  };

  const handleSuccessModalClose = () => {
    setShowSuccessModal(false);
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
                onClick={() => confirmDelete(appointment.id)} 
                className="delete-button"
              >
                Cancel
              </button>
            </div>
          ))}
        </div>
      )}
      {showConfirmModal && (
        <ConfirmationModal
          message="Are you sure you want to cancel this appointment?"
          onConfirm={handleDelete}
          onCancel={() => setShowConfirmModal(false)}
        />
      )}
      {showSuccessModal && (
        <SuccessModal
          message="Appointment cancelled successfully!"
          onClose={handleSuccessModalClose}
        />
      )}
    </div>
  );
};

export default Appointments;