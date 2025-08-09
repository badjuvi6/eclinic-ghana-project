import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, getDocs, query, where, addDoc } from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';
import Modal from './Modal';
import './BookAppointment.css';

const BookAppointment = ({ close }) => {
  const { currentUser } = useAuth();
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [appointmentDate, setAppointmentDate] = useState('');
  const [appointmentTime, setAppointmentTime] = useState('');
  const [error, setError] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  useEffect(() => {
    const fetchDoctors = async () => {
      const q = query(collection(db, 'users'), where('userType', '==', 'doctor'));
      const querySnapshot = await getDocs(q);
      const doctorsList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        fullName: doc.data().fullName,
        email: doc.data().email
      }));
      setDoctors(doctorsList);
    };
    fetchDoctors();
  }, []);

  const handleBook = async (e) => {
    e.preventDefault();
    setError('');

    if (!selectedDoctor || !appointmentDate || !appointmentTime) {
      setError('Please fill in all fields.');
      return;
    }

    try {
      await addDoc(collection(db, 'appointments'), {
        patientId: currentUser.uid,
        doctorId: selectedDoctor,
        appointmentDate: appointmentDate,
        appointmentTime: appointmentTime,
        status: 'pending',
        createdAt: new Date()
      });
      setShowSuccessModal(true);
    } catch (err) {
      setError('Failed to book appointment.');
      console.error(err);
    }
  };

  const handleModalClose = () => {
    setShowSuccessModal(false);
    close();
  };

  return (
    <div className="form-container">
      <h2>Book Appointment</h2>
      <form onSubmit={handleBook} className="booking-form">
        <div className="form-group">
          <label>Doctor</label>
          <select value={selectedDoctor} onChange={(e) => setSelectedDoctor(e.target.value)} required>
            <option value="">Select a Doctor</option>
            {doctors.map(doctor => (
              <option key={doctor.id} value={doctor.id}>{doctor.fullName}</option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label>Date</label>
          <input type="date" value={appointmentDate} onChange={(e) => setAppointmentDate(e.target.value)} required />
        </div>
        <div className="form-group">
          <label>Time</label>
          <input type="time" value={appointmentTime} onChange={(e) => setAppointmentTime(e.target.value)} required />
        </div>
        {error && <p className="error-message">{error}</p>}
        <button type="submit" className="book-button">Book</button>
      </form>
      {showSuccessModal && (
        <Modal 
          message="Appointment booked successfully!" 
          onConfirm={handleModalClose}
        />
      )}
    </div>
  );
};

export default BookAppointment;