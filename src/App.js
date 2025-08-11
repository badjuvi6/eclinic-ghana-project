import React, { useState, useEffect } from 'react';
import Login from './components/Login';
import Register from './components/Register';
import PatientDashboard from './components/dashboard';
import DoctorDashboard from './components/doctordashboard';
import HomePage from './components/HomePage';
import Header from './components/Header';
import { useAuth } from './contexts/AuthContext';
import { db } from './firebase';
import { doc, getDoc, collection, query, where, onSnapshot } from 'firebase/firestore';
import BookAppointment from './components/BookAppointment';
import Chat from './components/Chat';
import ChatList from './components/ChatList';
import Modal from './components/Modal';
import './App.css';

function App() {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [isChatListOpen, setIsChatListOpen] = useState(false);
  const [selectedChatId, setSelectedChatId] = useState(null);
  const [userType, setUserType] = useState(null);
  const [fullName, setFullName] = useState(null);
  const { currentUser, logout } = useAuth();
  const [isLogoutConfirmOpen, setIsLogoutConfirmOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [unreadChatCount, setUnreadChatCount] = useState(0);

  useEffect(() => {
    const fetchUserTypeAndName = async () => {
      setLoading(true);
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
      setLoading(false);
    };
    fetchUserTypeAndName();
  }, [currentUser]);

  useEffect(() => {
    if (!currentUser) return;
    
    // Listen for unread messages
    const q = query(collection(db, 'chats'), where('participants', 'array-contains', currentUser.uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      let unreadCount = 0;
      snapshot.docs.forEach(doc => {
        const chatData = doc.data();
        if (chatData.lastMessage && chatData.lastMessage.senderId !== currentUser.uid && !chatData.lastReadBy?.[currentUser.uid]) {
          unreadCount++;
        }
      });
      setUnreadChatCount(unreadCount);
    });

    return () => unsubscribe();
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

  const openLogoutConfirm = () => setIsLogoutConfirmOpen(true);
  const closeLogoutConfirm = () => setIsLogoutConfirmOpen(false);

  const handleLogout = async () => {
      await logout();
      closeLogoutConfirm();
  };

  if (loading) {
    return (
      <div className="loading-container">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="app-container">
      <Header
        isLoggedIn={!!currentUser}
        openLoginModal={openLoginModal}
        openRegisterModal={openRegisterModal}
        openChatList={openChatList}
        unreadChatCount={unreadChatCount}
      />

      <main className="main-content">
        {currentUser ? (
          userType === 'doctor' ? (
            <DoctorDashboard fullName={fullName} openLogoutConfirm={openLogoutConfirm} />
          ) : (
            <PatientDashboard fullName={fullName} openBookingModal={openBookingModal} openLogoutConfirm={openLogoutConfirm} />
          )
        ) : (
          <HomePage />
        )}
      </main>
      
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

      {isLogoutConfirmOpen && (
        <div className="modal-overlay">
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h3>Confirm Logout</h3>
            <p>Are you sure you want to log out?</p>
            <div className="modal-actions">
              <button onClick={handleLogout} className="confirm-button">Yes, Logout</button>
              <button onClick={closeLogoutConfirm} className="cancel-button">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
