import React, { useState, useEffect } from 'react';
import Login from './components/Login';
import Register from './components/Register';
import Appointments from './components/Appointments';
import DoctorAppointments from './components/DoctorAppointments';
import { useAuth } from './contexts/AuthContext';
import { auth, db } from './firebase';
import { doc, getDoc, query, where, collection, getDocs } from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import BookAppointment from './components/BookAppointment';
import Chat from './components/Chat';
import ChatList from './components/ChatList';
import DoctorSchedule from './components/DoctorSchedule'; // Import the new component
import './App.css';

function DoctorDashboard({ openChatList }) {
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
        <button onClick={openChatList} className="chat-button">Open Chat</button>
      </div>
      <div className="content">
        <DoctorSchedule />
        <DoctorAppointments />
      </div>
    </div>
  );
}

function PatientDashboard({ openBookingModal, openChatList }) {
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
        <button onClick={openChatList} className="chat-button">Open Chat</button>
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
  const [isChatListOpen, setIsChatListOpen] = useState(false);
  const [selectedChatId, setSelectedChatId] = useState(null);
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
  const openChatList = () => {
    setIsChatListOpen(true);
    setSelectedChatId(null);
  };
  const closeChatList = () => {
    setIsChatListOpen(false);
    setSelectedChatId(null);
  };
  const onSelectChat = (chatId) => {
    setSelectedChatId(chatId);
  };

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
      
      {currentUser && userType === 'doctor' && <DoctorDashboard openChatList={openChatList} />}
      {currentUser && userType === 'patient' && <PatientDashboard openBookingModal={openBookingModal} openChatList={openChatList} />}
      {!currentUser && (
        <main className="app-main-content">
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

      {isChatListOpen && !selectedChatId && (
        <ChatList onSelectChat={onSelectChat} />
      )}

      {selectedChatId && (
        <Chat chatId={selectedChatId} close={closeChatList} />
      )}

    </div>
  );
}

export default App;