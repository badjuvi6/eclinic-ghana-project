import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';

const DoctorDashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  const getAppointments = async () => {
    const appointmentsCollectionRef = collection(db, 'appointments');
    const data = await getDocs(appointmentsCollectionRef);
    setAppointments(data.docs.map(doc => ({ ...doc.data(), id: doc.id })));
    setLoading(false);
  };

  useEffect(() => {
    getAppointments();
  }, []);

  return (
    <div>
      <h3>Doctor's Dashboard</h3>
      <h4>All Upcoming Appointments</h4>
      {loading ? (
        <p>Loading all appointments...</p>
      ) : (
        <div>
          {appointments.length > 0 ? (
            <ul>
              {appointments.map(appointment => (
                <li key={appointment.id}>
                  **Patient ID:** {appointment.patientId} | **Doctor:** {appointment.doctor} | **Date:** {appointment.date} | **Time:** {appointment.time}
                </li>
              ))}
            </ul>
          ) : (
            <p>There are no upcoming appointments.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default DoctorDashboard;