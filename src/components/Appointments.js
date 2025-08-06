import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, addDoc, getDocs, query, where } from 'firebase/firestore';
import { auth } from '../firebase';

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [newAppointment, setNewAppointment] = useState({ doctor: '', date: '', time: '' });
  const [loading, setLoading] = useState(true);

  const appointmentsCollectionRef = collection(db, 'appointments');
  const user = auth.currentUser;

  const getAppointments = async () => {
    if (!user) return;
    const q = query(appointmentsCollectionRef, where('patientId', '==', user.uid));
    const data = await getDocs(q);
    setAppointments(data.docs.map(doc => ({ ...doc.data(), id: doc.id })));
    setLoading(false);
  };

  const createAppointment = async (e) => {
    e.preventDefault();
    if (!user) return;
    await addDoc(appointmentsCollectionRef, { ...newAppointment, patientId: user.uid });
    setNewAppointment({ doctor: '', date: '', time: '' });
    getAppointments();
  };

  useEffect(() => {
    getAppointments();
  }, []);

  return (
    <div>
      <h3>My Appointments</h3>
      {loading ? (
        <p>Loading appointments...</p>
      ) : (
        <div>
          {appointments.length > 0 ? (
            <ul>
              {appointments.map(appointment => (
                <li key={appointment.id}>
                  **Doctor:** {appointment.doctor} | **Date:** {appointment.date} | **Time:** {appointment.time}
                </li>
              ))}
            </ul>
          ) : (
            <p>You have no upcoming appointments.</p>
          )}
        </div>
      )}

      <h4>Schedule a New Appointment</h4>
      <form onSubmit={createAppointment}>
        <label>Doctor:</label>
        <input
          placeholder="Doctor's Name"
          value={newAppointment.doctor}
          onChange={(e) => setNewAppointment({ ...newAppointment, doctor: e.target.value })}
          required
        />
        <label>Date:</label>
        <input
          type="date"
          value={newAppointment.date}
          onChange={(e) => setNewAppointment({ ...newAppointment, date: e.target.value })}
          required
        />
        <label>Time:</label>
        <input
          type="time"
          value={newAppointment.time}
          onChange={(e) => setNewAppointment({ ...newAppointment, time: e.target.value })}
          required
        />
        <button type="submit">Schedule</button>
      </form>
    </div>
  );
};

export default Appointments;