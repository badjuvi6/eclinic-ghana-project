import React from 'react';
import './Header.css';

const Header = ({
  fullName,
  isLoggedIn,
  openLoginModal,
  openRegisterModal,
  openChatList,
  unreadChatCount
}) => {
  return (
    <header className="app-header">
      <div className="header-left">
        <div className="app-logo-text">eClinic</div>
      </div>
      <div className="header-right">
        {isLoggedIn ? (
          <>
            <div className="chat-button-container">
              <button onClick={openChatList} className="nav-button">Open Chats</button>
              {unreadChatCount > 0 && <span className="unread-badge">{unreadChatCount}</span>}
            </div>

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