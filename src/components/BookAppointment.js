import React, { useState } from 'react';
import { db } from '../firebase';
import { collection, addDoc } from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';
import './BookAppointment.css';

const BookAppointment = ({ close }) => {
  const { currentUser } = useAuth();
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [doctorId, setDoctorId] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Hardcoded doctors for now. You can fetch these from Firestore later.
  const doctors = [
    { id: 'doctor1', name: 'Dr. Mensah' },
    { id: 'doctor2', name: 'Dr. Opoku' },
    { id: 'doctor3', name: 'Dr. Adjei' },
  ];

  const handleBookAppointment = async (e) => {
    e.preventDefault();
    if (!doctorId || !date || !time) {
      setError('Please fill in all fields.');
      return;
    }

    setLoading(true);
    try {
      const selectedDoctor = doctors.find(doc => doc.id === doctorId);
      await addDoc(collection(db, 'appointments'), {
        patientId: currentUser.uid,
        patientName: currentUser.email, // Using email as patient name for simplicity
        doctorId: doctorId,
        doctorName: selectedDoctor.name,
        date: date,
        time: time,
      });
      alert('Appointment booked successfully!');
      close();
    } catch (err) {
      setError('Failed to book appointment: ' + err.message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="book-appointment-container">
      <h2>Book an Appointment</h2>
      <form onSubmit={handleBookAppointment}>
        <div className="form-group">
          <label>Select Doctor:</label>
          <select value={doctorId} onChange={(e) => setDoctorId(e.target.value)} required>
            <option value="">-- Select a Doctor --</option>
            {doctors.map(doc => (
              <option key={doc.id} value={doc.id}>{doc.name}</option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label>Select Date:</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Select Time:</label>
          <input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            required
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Booking...' : 'Confirm Booking'}
        </button>
      </form>
      {error && <p className="error-message">{error}</p>}
    </div>
  );
};

export default BookAppointment;