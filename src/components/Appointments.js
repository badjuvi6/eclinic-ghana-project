import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, query, where, onSnapshot, doc, getDoc, deleteDoc } from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';
import Modal from './Modal';
import './Appointments.css';

const Appointments = ({ openBookingModal }) => {
  const { currentUser } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(null);
  const [modalMessage, setModalMessage] = useState('');
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
    setModalMessage("Are you sure you want to cancel this appointment?");
    setShowModal('confirm');
  };

  const handleDelete = async () => {
    try {
      if (appointmentToDelete) {
        await deleteDoc(doc(db, "appointments", appointmentToDelete));
        setModalMessage("Appointment cancelled successfully.");
        setShowModal('success');
      }
    } catch (err) {
      console.error("Error removing appointment: ", err);
      setModalMessage("Failed to cancel appointment.");
      setShowModal('error');
    } finally {
      setAppointmentToDelete(null);
    }
  };

  const handleModalClose = () => {
    setShowModal(null);
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
      {showModal === 'confirm' && (
        <Modal
          message={modalMessage}
          onConfirm={handleDelete}
          onCancel={handleModalClose}
        />
      )}
      {showModal === 'success' && (
        <Modal
          message={modalMessage}
          onConfirm={handleModalClose}
        />
      )}
      {showModal === 'error' && (
        <Modal
          message={modalMessage}
          onConfirm={handleModalClose}
        />
      )}
    </div>
  );
};

export default Appointments;