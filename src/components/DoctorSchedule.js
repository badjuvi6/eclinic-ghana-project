import React, { useState } from 'react';
import { db } from '../firebase';
import { collection, addDoc } from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';
import './DoctorSchedule.css';

const DoctorSchedule = () => {
  const { currentUser } = useAuth();
  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [message, setMessage] = useState('');

  const handleAddSchedule = async (e) => {
    e.preventDefault();
    if (!currentUser || !date || !startTime || !endTime) {
      setMessage('Please fill in all fields.');
      return;
    }

    try {
      await addDoc(collection(db, 'schedules'), {
        doctorId: currentUser.uid,
        date: date,
        startTime: startTime,
        endTime: endTime,
        isAvailable: true,
      });
      setMessage('Schedule added successfully!');
      setDate('');
      setStartTime('');
      setEndTime('');
    } catch (error) {
      console.error("Error adding schedule: ", error);
      setMessage('Failed to add schedule.');
    }
  };

  return (
    <div className="schedule-container">
      <h3>Set Your Schedule</h3>
      <form onSubmit={handleAddSchedule} className="schedule-form">
        <label>
          Date:
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
        </label>
        <label>
          Start Time:
          <input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} required />
        </label>
        <label>
          End Time:
          <input type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} required />
        </label>
        <button type="submit" className="add-schedule-button">Add Schedule</button>
      </form>
      {message && <p className="schedule-message">{message}</p>}
    </div>
  );
};

export default DoctorSchedule;