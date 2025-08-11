import React from 'react';
import './Header.css';

const Header = ({
  fullName,
  isLoggedIn,
  openLoginModal,
  openRegisterModal,
  openChatList
}) => {
  return (
    <header className="app-header">
      <div className="header-left">
        <div className="app-logo-text">eClinic</div>
        {isLoggedIn ? (
          <>
            <span className="greeting">Welcome, {fullName}!</span>
          </>
        ) : null}
      </div>
      <div className="header-right">
        <a href="#about-us" className="nav-link">☎️ About Us</a>
        <a href="mailto:info@eclinicghana.com" className="nav-link">✉️ Contact</a>
        {isLoggedIn ? (
          <>
            <button onClick={openChatList} className="nav-button">Open Chats</button>
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