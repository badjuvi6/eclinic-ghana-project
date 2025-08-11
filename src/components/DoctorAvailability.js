import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';
import './DoctorAvailability.css';

const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const DoctorAvailability = () => {
  const { currentUser } = useAuth();
  const [availableDays, setAvailableDays] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchAvailability = async () => {
      if (currentUser) {
        const docRef = doc(db, 'doctorAvailability', currentUser.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setAvailableDays(docSnap.data().days || []);
        }
      }
    };
    fetchAvailability();
  }, [currentUser]);

  const handleDayChange = (day) => {
    setAvailableDays(prevDays =>
      prevDays.includes(day)
        ? prevDays.filter(d => d !== day)
        : [...prevDays, day]
    );
  };

  const handleSaveAvailability = async () => {
    if (!currentUser) {
      setMessage('You must be logged in to save your availability.');
      return;
    }

    try {
      await setDoc(doc(db, 'doctorAvailability', currentUser.uid), {
        days: availableDays,
      });
      setMessage('Availability saved successfully!');
    } catch (error) {
      console.error("Error saving availability: ", error);
      setMessage('Failed to save availability.');
    }
  };

  return (
    <div className="availability-container">
      <h3>Set Your Available Days</h3>
      <div className="days-list">
        {daysOfWeek.map(day => (
          <label key={day} className="day-checkbox">
            <input
              type="checkbox"
              checked={availableDays.includes(day)}
              onChange={() => handleDayChange(day)}
            />
            {day}
          </label>
        ))}
      </div>
      <button onClick={handleSaveAvailability} className="save-button">Save Availability</button>
      {message && <p className="availability-message">{message}</p>}
    </div>
  );
};

export default DoctorAvailability;