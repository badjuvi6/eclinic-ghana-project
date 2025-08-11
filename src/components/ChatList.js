import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../firebase';
import { collection, query, where, onSnapshot, doc, getDoc } from 'firebase/firestore';
import './ChatList.css';

const ChatList = ({ onSelectChat, close }) => {
  const { currentUser } = useAuth();
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUser) return;

    const q = query(collection(db, 'chats'), where('participants', 'array-contains', currentUser.uid));
    const unsubscribe = onSnapshot(q, async (snapshot) => {
      const chatPromises = snapshot.docs.map(async (chatDoc) => {
        const chat = { id: chatDoc.id, ...chatDoc.data() };
        const otherUserId = chat.participants.find(id => id !== currentUser.uid);
        if (otherUserId) {
          const userRef = doc(db, 'users', otherUserId);
          const userSnap = await getDoc(userRef);
          if (userSnap.exists()) {
            chat.otherUserName = userSnap.data().fullName;
          } else {
            chat.otherUserName = 'Unknown User';
          }
        }
        // Check for unread status
        const isUnread = chat.lastMessage && chat.lastMessage.senderId !== currentUser.uid && !chat.lastReadBy?.[currentUser.uid];
        chat.isUnread = isUnread;
        return chat;
      });
      const chatList = await Promise.all(chatPromises);
      setChats(chatList);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [currentUser]);

  if (loading) {
    return (
      <div className="chat-list-container">
        <p>Loading chats...</p>
      </div>
    );
  }

  return (
    <div className="chat-list-container">
      <div className="chat-list-header">
        <h3>Your Chats</h3>
        <button onClick={close} className="close-button">&times;</button>
      </div>
      {chats.length === 0 ? (
        <p>You have no chats yet.</p>
      ) : (
        <ul className="chat-list">
          {chats.map(chat => (
            <li key={chat.id} onClick={() => onSelectChat(chat.id)} className="chat-item">
              <span>{chat.otherUserName}</span>
              {chat.isUnread && <span className="unread-dot"></span>}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ChatList;