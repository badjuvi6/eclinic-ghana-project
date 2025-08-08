import React, { useState, useEffect } from 'react';
import Login from './components/Login';
import Register from './components/Register';
import Appointments from './components/Appointments';
import DoctorAppointments from './components/DoctorAppointments';
import { useAuth } from './contexts/AuthContext';
import { auth, db } from './firebase';
import { doc, getDoc } from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import BookAppointment from './components/BookAppointment';
import './App.css';

function DoctorDashboard() {
  const { currentUser } = useAuth();
  const handleLogout = async () => {
    try {
      await signOut(auth);
      alert('Logged out successfully!');
    } catch (err) {
      alert('Failed to log out.');
    }
  };

  return (
    <div className="dashboard-container">
      <div className="user-info">
        <h2>Doctor Dashboard</h2>
        <p>Welcome, Dr. {currentUser.email}!</p>
        <button onClick={handleLogout} className="logout-button">Logout</button>
      </div>
      <div className="content">
        <DoctorAppointments />
      </div>
    </div>
  );
}

function PatientDashboard({ openBookingModal }) {
  const { currentUser } = useAuth();
  const handleLogout = async () => {
    try {
      await signOut(auth);
      alert('Logged out successfully!');
    } catch (err) {
      alert('Failed to log out.');
    }
  };

  return (
    <div className="dashboard-container">
      <div className="user-info">
        <h2>Patient Dashboard</h2>
        <p>Welcome, {currentUser.email}!</p>
        <button onClick={handleLogout} className="logout-button">Logout</button>
      </div>
      <div className="content">
        <Appointments openBookingModal={openBookingModal} />
      </div>
    </div>
  );
}

function App() {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [userType, setUserType] = useState(null);
  const { currentUser } = useAuth();

  useEffect(() => {
    const fetchUserType = async () => {
      if (currentUser) {
        const docRef = doc(db, 'users', currentUser.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setUserType(docSnap.data().userType);
        } else {
          setUserType('patient');
        }
      } else {
        setUserType(null);
      }
    };
    fetchUserType();
  }, [currentUser]);

  const openLoginModal = () => setIsLoginModalOpen(true);
  const closeLoginModal = () => setIsLoginModalOpen(false);
  const openRegisterModal = () => setIsRegisterModalOpen(true);
  const closeRegisterModal = () => setIsRegisterModalOpen(false);
  const openBookingModal = () => setIsBookingModalOpen(true);
  const closeBookingModal = () => setIsBookingModalOpen(false);
  const openChat = () => setIsChatOpen(true);
  const closeChat = () => setIsChatOpen(false);

  return (
    <div className="app-container">
      <header className="app-header">
        {!currentUser && (
          <>
            <button onClick={openLoginModal} className="login-button">Login</button>
            <button onClick={openRegisterModal} className="register-button">Register</button>
          </>
        )}
      </header>
      
      {currentUser && userType === 'doctor' && <DoctorDashboard openChat={openChat} />}
      {currentUser && userType === 'patient' && <PatientDashboard openBookingModal={openBookingModal} openChat={openChat} />}
      {!currentUser && (
        <main className="app-main-content">
          {/* The image is now a background, so no <img> tag is needed here */}
          <h1>Welcome to eClinic</h1>
          <p>A digital solution for your health needs.</p>
        </main>
      )}

      {isLoginModalOpen && (
        <div className="modal-overlay" onClick={closeLoginModal}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <Login close={closeLoginModal} />
          </div>
        </div>
      )}

      {isRegisterModalOpen && (
        <div className="modal-overlay" onClick={closeRegisterModal}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <Register close={closeRegisterModal} />
          </div>
        </div>
      )}

      {isBookingModalOpen && (
        <div className="modal-overlay" onClick={closeBookingModal}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <BookAppointment close={closeBookingModal} />
          </div>
        </div>
      )}

      {isChatOpen && (
        <Chat chatId="demo-chat-id" close={closeChat} />
      )}

    </div>
  );
}

export default App;