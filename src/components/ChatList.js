import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, getDocs, query, where, doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';
import './ChatList.css';

const ChatList = ({ onSelectChat, close }) => {
  const { currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastReadTimestamps, setLastReadTimestamps] = useState({});
  const [lastMessageTimestamps, setLastMessageTimestamps] = useState({});

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

    const listenForChatActivity = () => {
      const chatsQuery = query(collection(db, 'chats'), where('users', 'array-contains', currentUser.uid));
      return onSnapshot(chatsQuery, (snapshot) => {
        const lastMsgTimestamps = {};
        const readTimestamps = {};
        snapshot.forEach(doc => {
          const chatData = doc.data();
          lastMsgTimestamps[doc.id] = chatData.lastMessageTimestamp;
          readTimestamps[doc.id] = chatData.lastReadTimestamp?.[currentUser.uid];
        });
        setLastMessageTimestamps(lastMsgTimestamps);
        setLastReadTimestamps(readTimestamps);
      });
    };

    fetchUsers();
    const unsubscribe = listenForChatActivity();
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

    // Update the last read timestamp for this user in this chat
    await updateDoc(chatRef, {
      [`lastReadTimestamp.${currentUser.uid}`]: serverTimestamp()
    });

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
          const hasUnread = lastMessageTimestamps[combinedId] &&
                            (!lastReadTimestamps[combinedId] || lastMessageTimestamps[combinedId].toDate() > lastReadTimestamps[combinedId].toDate());
          
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