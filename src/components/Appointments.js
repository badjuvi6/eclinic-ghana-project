import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, query, where, onSnapshot, doc, getDoc, deleteDoc, updateDoc } from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';
import Modal from './Modal';
import './Appointments.css';

const Appointments = ({ openBookingModal }) => {
  const { currentUser } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(null);
  const [modalMessage, setModalMessage] = useState('');
  const [appointmentToHandle, setAppointmentToHandle] = useState(null);

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

  const confirmCancel = (appointmentId) => {
    setAppointmentToHandle(appointmentId);
    setModalMessage("Are you sure you want to cancel this appointment?");
    setShowModal('confirmCancel');
  };

  const handleCancel = async () => {
    try {
      if (appointmentToHandle) {
        await updateDoc(doc(db, "appointments", appointmentToHandle), {
          status: 'Cancelled by Patient'
        });
        setModalMessage("Appointment cancelled successfully.");
        setShowModal('success');
      }
    } catch (err) {
      console.error("Error removing appointment: ", err);
      setModalMessage("Failed to cancel appointment.");
      setShowModal('error');
    } finally {
      setAppointmentToHandle(null);
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
            <div key={appointment.id} className={`appointment-card status-${appointment.status.toLowerCase().replace(/ /g, '-')}`}>
              <p><strong>Doctor:</strong> {appointment.doctorName}</p>
              <p><strong>Date:</strong> {appointment.appointmentDate}</p>
              <p><strong>Time:</strong> {appointment.appointmentTime}</p>
              <p><strong>Status:</strong> {appointment.status || 'Pending'}</p>
              {appointment.status !== 'Declined' && appointment.status !== 'Cancelled by Patient' && (
                <button
                  onClick={() => confirmCancel(appointment.id)}
                  className="delete-button"
                >
                  Cancel
                </button>
              )}
            </div>
          ))}
        </div>
      )}
      {showModal === 'confirmCancel' && (
        <Modal
          message={modalMessage}
          onConfirm={handleCancel}
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