import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp } from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';
import './Chat.css';

const Chat = ({ chatId, close }) => {
  const { currentUser } = useAuth();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    if (!chatId) return;

    const q = query(collection(db, 'chats', chatId, 'messages'), orderBy('createdAt', 'asc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setMessages(msgs);
    });

    return () => unsubscribe();
  }, [chatId]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    await addDoc(collection(db, 'chats', chatId, 'messages'), {
      text: newMessage,
      senderId: currentUser.uid,
      senderName: currentUser.email,
      createdAt: serverTimestamp(),
    });

    setNewMessage('');
  };

  return (
    <div className="chat-window">
      <div className="chat-header">
        <h3>Chat</h3>
        <button onClick={close} className="close-chat-button">&times;</button>
      </div>
      <div className="messages-container">
        {messages.map(msg => (
          <div key={msg.id} className={`message ${msg.senderId === currentUser.uid ? 'sent' : 'received'}`}>
            <p>{msg.text}</p>
          </div>
        ))}
      </div>
      <form onSubmit={handleSendMessage} className="message-input-form">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
};

export default Chat;