import React, { useState } from 'react';
import Login from './components/Login';
import Register from './components/Register';
import { useAuth } from './contexts/AuthContext'; // Import the useAuth hook
import { auth } from './firebase';
import { signOut } from 'firebase/auth';
import './App.css';

function Dashboard() {
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
      <h2>Dashboard</h2>
      <p>Welcome, {currentUser.email}!</p>
      <button onClick={handleLogout} className="logout-button">Logout</button>
    </div>
  );
}

function App() {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const { currentUser } = useAuth(); // Use the hook here

  const openLoginModal = () => setIsLoginModalOpen(true);
  const closeLoginModal = () => setIsLoginModalOpen(false);

  const openRegisterModal = () => setIsRegisterModalOpen(true);
  const closeRegisterModal = () => setIsRegisterModalOpen(false);

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
        <Dashboard />
      ) : (
        <main className="app-main-content">
          <h1>Welcome to eClinic</h1>
          <p>A digital solution for your health needs.</p>
        </main>
      )}

      {/* Login Modal */}
      {isLoginModalOpen && (
        <div className="modal-overlay" onClick={closeLoginModal}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <Login close={closeLoginModal} />
          </div>
        </div>
      )}

      {/* Register Modal */}
      {isRegisterModalOpen && (
        <div className="modal-overlay" onClick={closeRegisterModal}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <Register close={closeRegisterModal} />
          </div>
        </div>
      )}
    </div>
  );
}

export default App;