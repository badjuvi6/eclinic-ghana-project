import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, getDocs, query, where, doc, getDoc, setDoc } from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';
import './ChatList.css';

const ChatList = ({ onSelectChat, userType }) => {
  const { currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      // Find all users who are not the current user
      const usersQuery = query(collection(db, 'users'), where('uid', '!=', currentUser.uid));
      const querySnapshot = await getDocs(usersQuery);
      
      const userList = querySnapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id
      }));
      setUsers(userList);
      setLoading(false);
    };

    if (currentUser) {
      fetchUsers();
    }
  }, [currentUser]);

  const handleSelectUser = async (user) => {
    // Create a unique chat ID by combining the UIDs of the two users
    const combinedId = currentUser.uid > user.uid ? currentUser.uid + user.uid : user.uid + currentUser.uid;
    const chatRef = doc(db, 'chats', combinedId);
    const chatDoc = await getDoc(chatRef);

    if (!chatDoc.exists()) {
      // Create the chat if it doesn't exist
      await setDoc(chatRef, {
        users: [currentUser.uid, user.uid],
        createdAt: new Date()
      });
    }
    
    // Pass the combined chat ID to the parent component
    onSelectChat(combinedId);
  };

  if (loading) {
    return <div>Loading chats...</div>;
  }

  return (
    <div className="chatlist-container">
      <h3>Available to Chat</h3>
      <div className="chat-users-list">
        {users.map(user => (
          <div key={user.id} className="chat-user-item" onClick={() => handleSelectUser(user)}>
            <p className="user-email">{user.email}</p>
            <p className="user-type">({user.userType})</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChatList;