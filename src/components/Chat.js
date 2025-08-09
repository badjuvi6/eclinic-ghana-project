import React, { useState, useEffect, useRef } from 'react';
import { db } from '../firebase';
import { collection, addDoc, doc, updateDoc, query, orderBy, serverTimestamp, onSnapshot } from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';
import './Chat.css';

const Chat = ({ chatId, close }) => {
  const { currentUser } = useAuth();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef(null);
  const chatRef = doc(db, 'chats', chatId);

  useEffect(() => {
    if (!chatId) return;

    const messagesQuery = query(
      collection(db, 'chats', chatId, 'messages'),
      orderBy('createdAt')
    );
    
    const unsubscribe = onSnapshot(messagesQuery, (snapshot) => {
      const messagesList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setMessages(messagesList);
    });

    return () => unsubscribe();
  }, [chatId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (newMessage.trim() === '') return;

    try {
      // 1. Add the new message to the messages subcollection
      await addDoc(collection(db, 'chats', chatId, 'messages'), {
        text: newMessage,
        senderId: currentUser.uid,
        createdAt: serverTimestamp(),
      });
      
      // 2. Update the parent chat document with the last message info
      await updateDoc(chatRef, {
        lastMessageTimestamp: serverTimestamp(),
      });

      setNewMessage('');
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <div className="chat-container">
      <div className="chat-header">
        <h3>Chat</h3>
        <button onClick={close} className="close-button">X</button>
      </div>
      <div className="messages-list">
        {messages.map(msg => (
          <div key={msg.id} className={`message-wrapper ${msg.senderId === currentUser.uid ? 'sent' : 'received'}`}>
            <div className="message">
              <p>{msg.text}</p>
            </div>
            <span className="timestamp">{msg.createdAt?.toDate().toLocaleTimeString()}</span>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={handleSendMessage} className="message-form">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
          className="message-input"
        />
        <button type="submit" className="send-button">Send</button>
      </form>
    </div>
  );
};

export default Chat;