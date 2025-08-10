import React from 'react';
import './Header.css';

const Header = ({
  fullName,
  isLoggedIn,
  openLoginModal,
  openRegisterModal,
  openChatList,
  openLogoutConfirm
}) => {
  return (
    <header className="app-header">
      <div className="header-left">
        <div className="app-logo-text">eClinic</div>
        <a href="#about-us" className="nav-link">☎️ About Us</a>
        <a href="mailto:info@eclinicghana.com" className="nav-link">✉️ Contact</a>
      </div>
      <div className="header-right">
        {isLoggedIn ? (
          <>
            <span className="greeting">Welcome, {fullName}!</span>
            <button onClick={openChatList} className="nav-button">Open Chats</button>
            <button onClick={openLogoutConfirm} className="nav-button">Logout</button>
          </>
        ) : (
          <>
            <button onClick={openLoginModal} className="nav-button">Login</button>
            <button onClick={openRegisterModal} className="nav-button">Register</button>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;