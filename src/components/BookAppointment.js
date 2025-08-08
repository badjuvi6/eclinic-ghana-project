import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, getDocs, doc, setDoc, query, where } from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';
import './BookAppointment.css';

const BookAppointment = ({ close }) => {
  const { currentUser } = useAuth();
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [appointmentDate, setAppointmentDate] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDoctors = async () => {
      const doctorsRef = collection(db, 'users');
      const q = query(doctorsRef, where('userType', '==', 'doctor'));
      const querySnapshot = await getDocs(q);
      const doctorsList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setDoctors(doctorsList);
      setLoading(false);
    };

    fetchDoctors();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedDoctor || !appointmentDate) {
      alert('Please select a doctor and date.');
      return;
    }

    try {
      const appointmentRef = doc(collection(db, 'appointments'));
      await setDoc(appointmentRef, {
        patientId: currentUser.uid,
        patientEmail: currentUser.email,
        doctorId: selectedDoctor,
        appointmentDate: appointmentDate,
        createdAt: new Date(),
      });
      alert('Appointment booked successfully!');
      close();
    } catch (err) {
      console.error("Error booking appointment: ", err);
      alert('Failed to book appointment.');
    }
  };

  if (loading) {
    return <div>Loading doctors...</div>;
  }

  return (
    <div className="form-container">
      <h2>Book Appointment</h2>
      <form onSubmit={handleSubmit} className="booking-form">
        <div className="form-group">
          <label>Select Doctor:</label>
          <select value={selectedDoctor} onChange={(e) => setSelectedDoctor(e.target.value)} required>
            <option value="">--Select a doctor--</option>
            {doctors.map(doctor => (
              <option key={doctor.id} value={doctor.id}>
                {doctor.fullName || doctor.email} {/* Now displays full name or email */}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label>Appointment Date:</label>
          <input
            type="date"
            value={appointmentDate}
            onChange={(e) => setAppointmentDate(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="book-button">Book Appointment</button>
      </form>
    </div>
  );
};

export default BookAppointment;