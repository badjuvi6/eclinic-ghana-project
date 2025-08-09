import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, getDocs, query, where, doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';
import './ChatList.css';

const ChatList = ({ onSelectChat, close }) => {
  const { currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [unreadChats, setUnreadChats] = useState({});

  useEffect(() => {
    if (!currentUser) return;

    const fetchUsers = async () => {
      const usersQuery = query(collection(db, 'users'), where('uid', '!=', currentUser.uid));
      const querySnapshot = await getDocs(usersQuery);
      
      const userList = querySnapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id
      }));
      setUsers(userList);
      setLoading(false);
    };

    const listenForUnreadChats = () => {
      const chatsQuery = query(collection(db, 'chats'), where('users', 'array-contains', currentUser.uid));
      return onSnapshot(chatsQuery, (snapshot) => {
        const unreadStatus = {};
        snapshot.forEach(async (chatDoc) => {
          const chatData = chatDoc.data();
          const messagesQuery = query(collection(db, 'chats', chatDoc.id, 'messages'), where('senderId', '!=', currentUser.uid));
          const messagesSnapshot = await getDocs(messagesQuery);

          let hasUnread = false;
          messagesSnapshot.forEach(msgDoc => {
            if (!chatData.readBy || !chatData.readBy.includes(currentUser.uid)) {
              hasUnread = true;
            }
          });
          if (hasUnread) {
             unreadStatus[chatDoc.id] = true;
          }
        });
        setUnreadChats(unreadStatus);
      });
    };

    fetchUsers();
    const unsubscribe = listenForUnreadChats();
    return () => unsubscribe();
  }, [currentUser]);

  const handleSelectUser = async (user) => {
    const combinedId = currentUser.uid > user.uid ? currentUser.uid + user.uid : user.uid + currentUser.uid;
    const chatRef = doc(db, 'chats', combinedId);
    const chatDoc = await getDoc(chatRef);

    if (!chatDoc.exists()) {
      await setDoc(chatRef, {
        users: [currentUser.uid, user.uid],
        createdAt: new Date()
      });
    }
    
    // Mark as read when the chat is opened
    await setDoc(chatRef, { readBy: [currentUser.uid, user.uid] }, { merge: true });
    
    onSelectChat(combinedId);
  };

  if (loading) {
    return <div className="chatlist-container">Loading chats...</div>;
  }

  return (
    <div className="chatlist-container">
      <div className="chatlist-header">
        <h3>Available to Chat</h3>
        <button onClick={close} className="close-button">X</button>
      </div>
      <div className="chat-users-list">
        {users.map(user => {
          const combinedId = currentUser.uid > user.uid ? currentUser.uid + user.uid : user.uid + currentUser.uid;
          const hasUnread = unreadChats[combinedId];
          return (
            <div key={user.id} className="chat-user-item" onClick={() => handleSelectUser(user)}>
              <p className="user-name">{user.fullName || user.email}</p>
              <p className="user-type">({user.userType})</p>
              {hasUnread && <div className="unread-dot"></div>}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ChatList;