import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';
import './Appointments.css'; // Reusing the same CSS file

const DoctorAppointments = () => {
  const { currentUser } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAppointments = async () => {
      if (currentUser) {
        setLoading(true);
        try {
          // This query is different. It finds appointments where the doctorId matches the logged-in user's ID.
          const q = query(
            collection(db, 'appointments'),
            where('doctorId', '==', currentUser.uid)
          );
          const querySnapshot = await getDocs(q);
          const fetchedAppointments = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
          }));
          setAppointments(fetchedAppointments);
        } catch (error) {
          console.error('Error fetching doctor appointments:', error);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchAppointments();
  }, [currentUser]);

  if (loading) {
    return <div className="loading">Loading your appointments...</div>;
  }

  return (
    <div className="appointments-container">
      <h2>Your Upcoming Appointments</h2>
      {appointments.length > 0 ? (
        <ul className="appointments-list">
          {appointments.map(appointment => (
            <li key={appointment.id} className="appointment-item">
              <p><strong>Patient:</strong> {appointment.patientName}</p>
              <p><strong>Date:</strong> {appointment.date}</p>
              <p><strong>Time:</strong> {appointment.time}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>You have no appointments scheduled.</p>
      )}
    </div>
  );
};

export default DoctorAppointments;