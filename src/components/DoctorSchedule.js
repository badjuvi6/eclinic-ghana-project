import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';
import './DoctorSchedule.css';

const DoctorSchedule = () => {
  const { currentUser } = useAuth();
  const [schedule, setSchedule] = useState({
    monday: false,
    tuesday: false,
    wednesday: false,
    thursday: false,
    friday: false,
  });

  useEffect(() => {
    const fetchSchedule = async () => {
      if (currentUser) {
        const docRef = doc(db, 'doctorAvailability', currentUser.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setSchedule(docSnap.data());
        }
      }
    };
    fetchSchedule();
  }, [currentUser]);

  const handleToggleDay = (day) => {
    setSchedule(prevSchedule => ({
      ...prevSchedule,
      [day]: !prevSchedule[day]
    }));
  };

  const handleSaveSchedule = async () => {
    if (currentUser) {
      const docRef = doc(db, 'doctorAvailability', currentUser.uid);
      await setDoc(docRef, schedule);
      alert('Schedule saved successfully!');
    }
  };

  return (
    <div className="schedule-container">
      <h3>Set Your Weekly Schedule</h3>
      <div className="days-list">
        {Object.keys(schedule).map(day => (
          <div
            key={day}
            className={`day-item ${schedule[day] ? 'active' : ''}`}
            onClick={() => handleToggleDay(day)}
          >
            {day.charAt(0).toUpperCase() + day.slice(1)}
          </div>
        ))}
      </div>
      <button onClick={handleSaveSchedule} className="save-button">Save Schedule</button>
    </div>
  );
};

export default DoctorSchedule;