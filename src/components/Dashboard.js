import React from 'react';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';
import Appointments from './Appointments'; // Import the new component

const Dashboard = ({ user }) => {
  const handleLogout = async () => {
    try {
      await signOut(auth);
      console.log('User signed out successfully!');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <div>
      <h2>User Dashboard</h2>
      <p>Welcome, {user.email}!</p>
      <button onClick={handleLogout}>Logout</button>
      
      <hr />
      
      <Appointments />
    </div>
  );
};

export default Dashboard;