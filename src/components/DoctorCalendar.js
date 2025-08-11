import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';
import './DoctorCalendar.css';

const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const DoctorCalendar = () => {
  const { currentUser } = useAuth();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [availability, setAvailability] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      if (currentUser) {
        // Fetch doctor's availability
        const availabilityRef = doc(db, 'doctorAvailability', currentUser.uid);
        const availabilitySnap = await getDoc(availabilityRef);
        if (availabilitySnap.exists()) {
          setAvailability(availabilitySnap.data().days || []);
        }

        // Fetch doctor's appointments
        const appointmentsRef = doc(db, 'appointments', currentUser.uid);
        const appointmentsSnap = await getDoc(appointmentsRef);
        if (appointmentsSnap.exists()) {
          setAppointments(appointmentsSnap.data().appointments || []);
        }
      }
    };
    fetchData();
  }, [currentUser]);

  const toggleAvailability = async (dayString) => {
    if (!currentUser) {
      setMessage('You must be logged in to update availability.');
      return;
    }
    const newAvailability = availability.includes(dayString)
      ? availability.filter(d => d !== dayString)
      : [...availability, dayString];

    try {
      const availabilityRef = doc(db, 'doctorAvailability', currentUser.uid);
      await setDoc(availabilityRef, { days: newAvailability }, { merge: true });
      setAvailability(newAvailability);
      setMessage('Availability updated successfully!');
    } catch (error) {
      console.error("Error updating availability: ", error);
      setMessage('Failed to update availability.');
    }
  };

  const renderHeader = () => {
    const dateFormat = new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'long' }).format(currentDate);
    return (
      <div className="calendar-header">
        <button onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() - 1)))}>&lt;</button>
        <span>{dateFormat}</span>
        <button onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() + 1))) }>&gt;</button>
      </div>
    );
  };

  const renderDays = () => {
    return (
      <div className="calendar-days">
        {daysOfWeek.map(day => <div key={day} className="day-name">{day}</div>)}
      </div>
    );
  };

  const renderCells = () => {
    const monthStart = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const monthEnd = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    const startDate = new Date(monthStart.setDate(monthStart.getDate() - monthStart.getDay()));
    const endDate = new Date(monthEnd.setDate(monthEnd.getDate() + (6 - monthEnd.getDay())));

    const rows = [];
    let day = startDate;
    let formattedDate = '';

    while (day <= endDate) {
      const week = [];
      for (let i = 0; i < 7; i++) {
        formattedDate = new Intl.DateTimeFormat('en-US').format(day);
        const dayString = daysOfWeek[day.getDay()];
        const isAppointmentDay = appointments.some(app => app.appointmentDate === formattedDate);
        const isAvailableDay = availability.includes(dayString);

        week.push(
          <div
            key={day}
            className={`calendar-cell ${day.getMonth() !== currentDate.getMonth() ? 'disabled' : ''} ${isAvailableDay ? 'available' : ''} ${isAppointmentDay ? 'appointment-day' : ''}`}
            onClick={() => toggleAvailability(dayString)}
          >
            {day.getDate()}
          </div>
        );
        day = new Date(day.setDate(day.getDate() + 1));
      }
      rows.push(<div key={day} className="calendar-row">{week}</div>);
    }
    return <div className="calendar-body">{rows}</div>;
  };

  return (
    <div className="calendar-container">
      <h3>Manage Your Schedule</h3>
      {renderHeader()}
      {renderDays()}
      {renderCells()}
      {message && <p className="calendar-message">{message}</p>}
    </div>
  );
};

export default DoctorCalendar;