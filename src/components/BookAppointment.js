import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, getDocs, query, where, addDoc, doc, getDoc } from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';
import Modal from './Modal';
import DoctorProfileModal from './DoctorProfileModal'; // Import the new modal
import './BookAppointment.css';

const BookAppointment = ({ close }) => {
  const { currentUser } = useAuth();
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [appointmentDate, setAppointmentDate] = useState('');
  const [appointmentTime, setAppointmentTime] = useState('');
  const [error, setError] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showDoctorProfile, setShowDoctorProfile] = useState(false);
  const [selectedDoctorProfile, setSelectedDoctorProfile] = useState(null);

  useEffect(() => {
    const fetchDoctors = async () => {
      const q = query(collection(db, 'users'), where('userType', '==', 'doctor'));
      const querySnapshot = await getDocs(q);
      const doctorsList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        fullName: doc.data().fullName,
        email: doc.data().email,
        specialty: doc.data().specialty, // Fetch specialty
        bio: doc.data().bio // Fetch bio
      }));
      setDoctors(doctorsList);
    };
    fetchDoctors();
  }, []);

  const handleBook = async (e) => {
    e.preventDefault();
    setError('');

    if (!selectedDoctor || !appointmentDate || !appointmentTime) {
      setError('Please select a doctor, date, and time.');
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

  const viewDoctorProfile = (doctor) => {
    setSelectedDoctorProfile(doctor);
    setShowDoctorProfile(true);
  };

  const selectDoctorAndCloseProfile = (doctor) => {
    setSelectedDoctor(doctor.id);
    setSelectedDoctorProfile(null);
    setShowDoctorProfile(false);
  };

  const handleCloseDoctorProfile = () => {
    setShowDoctorProfile(false);
    setSelectedDoctorProfile(null);
  };

  return (
    <div className="form-container">
      <h2>Book Appointment</h2>
      {error && <p className="error-message">{error}</p>}
      
      {!selectedDoctor && (
        <div className="doctor-list">
          <h3>Available Doctors</h3>
          {doctors.map(doctor => (
            <div key={doctor.id} className="doctor-item">
              <div className="doctor-info">
                <h4>Dr. {doctor.fullName}</h4>
                <p>{doctor.specialty || 'General Practitioner'}</p>
              </div>
              <button 
                onClick={() => viewDoctorProfile(doctor)}
                className="view-profile-button"
              >
                View Profile
              </button>
            </div>
          ))}
        </div>
      )}

      {selectedDoctor && (
        <form onSubmit={handleBook} className="booking-form">
          <div className="form-group">
            <label>You have selected: <strong>Dr. {doctors.find(d => d.id === selectedDoctor)?.fullName}</strong></label>
          </div>
          <div className="form-group">
            <label>Date</label>
            <input type="date" value={appointmentDate} onChange={(e) => setAppointmentDate(e.target.value)} required />
          </div>
          <div className="form-group">
            <label>Time</label>
            <input type="time" value={appointmentTime} onChange={(e) => setAppointmentTime(e.target.value)} required />
          </div>
          <button type="submit" className="book-button">Confirm Booking</button>
          <button type="button" onClick={() => setSelectedDoctor('')} className="back-button">Back to Doctors</button>
        </form>
      )}

      {showSuccessModal && (
        <Modal 
          message="Appointment booked successfully!" 
          onConfirm={handleModalClose}
        />
      )}

      {showDoctorProfile && (
        <DoctorProfileModal
          doctor={selectedDoctorProfile}
          onBook={selectDoctorAndCloseProfile}
          onClose={handleCloseDoctorProfile}
        />
      )}
    </div>
  );
};

export default BookAppointment;