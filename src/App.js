import React, { useState, useEffect } from 'react';
import Login from './components/Login';
import Register from './components/Register';
import PatientDashboard from './components/dashboard';
import DoctorDashboard from './components/doctordashboard';
import HomePage from './components/HomePage';
import { useAuth } from './contexts/AuthContext';
import { auth, db } from './firebase';
import { doc, getDoc } from 'firebase/firestore';
import BookAppointment from './components/BookAppointment';
import Chat from './components/Chat';
import ChatList from './components/ChatList';
import './App.css';

function App() {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [isChatListOpen, setIsChatListOpen] = useState(false);
  const [selectedChatId, setSelectedChatId] = useState(null);
  const [userType, setUserType] = useState(null);
  const [fullName, setFullName] = useState(null);
  const { currentUser } = useAuth();

  useEffect(() => {
    const fetchUserTypeAndName = async () => {
      if (currentUser) {
        const docRef = doc(db, 'users', currentUser.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setUserType(docSnap.data().userType);
          setFullName(docSnap.data().fullName);
        } else {
          setUserType('patient');
          setFullName(null);
        }
      } else {
        setUserType(null);
        setFullName(null);
      }
    };
    fetchUserTypeAndName();
  }, [currentUser]);

  const openLoginModal = () => setIsLoginModalOpen(true);
  const closeLoginModal = () => setIsLoginModalOpen(false);
  const openRegisterModal = () => setIsRegisterModalOpen(true);
  const closeRegisterModal = () => setIsRegisterModalOpen(false);
  const openBookingModal = () => setIsBookingModalOpen(true);
  const closeBookingModal = () => {
    setIsBookingModalOpen(false);
  };
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

      {currentUser ? (
        userType === 'doctor' ? (
          <DoctorDashboard openChatList={openChatList} fullName={fullName} />
        ) : (
          <PatientDashboard openBookingModal={openBookingModal} openChatList={openChatList} fullName={fullName} />
        )
      ) : (
        <HomePage />
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
            <Register close={() => { closeRegisterModal(); alert('Registration successful! Please log in.'); }} />
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
        <ChatList onSelectChat={onSelectChat} close={closeChatList} />
      )}

      {selectedChatId && (
        <Chat chatId={selectedChatId} close={() => { setSelectedChatId(null); setIsChatListOpen(false); }} />
      )}
    </div>
  );
}

export default App;