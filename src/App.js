import React, { useState } from 'react';
import Login from './components/Login';
import Register from './components/Register';
import './App.css';

function App() {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);

  const openLoginModal = () => setIsLoginModalOpen(true);
  const closeLoginModal = () => setIsLoginModalOpen(false);
  
  const openRegisterModal = () => setIsRegisterModalOpen(true);
  const closeRegisterModal = () => setIsRegisterModalOpen(false);

  return (
    <div className="app-container">
      <header className="app-header">
        <button onClick={openLoginModal} className="login-button">Login</button>
        <button onClick={openRegisterModal} className="register-button">Register</button>
      </header>

      <main className="app-main-content">
        <h1>Welcome to eClinic</h1>
        <p>A digital solution for your health needs.</p>
      </main>

      {/* Login Modal */}
      {isLoginModalOpen && (
        <div className="modal-overlay" onClick={closeLoginModal}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <Login />
          </div>
        </div>
      )}

      {/* Register Modal */}
      {isRegisterModalOpen && (
        <div className="modal-overlay" onClick={closeRegisterModal}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <Register />
          </div>
        </div>
      )}
    </div>
  );
}

export default App;