import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import DoctorDashboard from './components/DoctorDashboard'; // Import the new component
import { auth } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        // We'll hardcode an admin email for now for simplicity
        // In a real app, this would be more secure
        if (currentUser.email === 'doctor@example.com') {
          setIsAdmin(true);
        } else {
          setIsAdmin(false);
        }
      } else {
        setIsAdmin(false);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <h1>eClinic Health App</h1>
        </header>
        <main>
          <Routes>
            <Route
              path="/dashboard"
              element={user ? (isAdmin ? <DoctorDashboard /> : <Dashboard user={user} />) : <Navigate to="/" />}
            />
            <Route
              path="/"
              element={user ? <Navigate to="/dashboard" /> : (
                <div style={{ display: 'flex', justifyContent: 'space-around', margin: '20px' }}>
                  <Login />
                  <Register />
                </div>
              )}
            />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;