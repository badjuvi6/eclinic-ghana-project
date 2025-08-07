import React, { useState } from 'react';
import { auth } from '../firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import './Login.css';

const Login = ({ close }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userType, setUserType] = useState('patient'); // Default to patient
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      setError('');
      await signInWithEmailAndPassword(auth, email, password);
      alert('User logged in successfully!');
      // Call the close function and pass the selected userType
      close(userType);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="form-container">
      <h2>Login</h2>
      <form onSubmit={handleLogin} className="auth-form">
        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Login As:</label>
          <select value={userType} onChange={(e) => setUserType(e.target.value)}>
            <option value="patient">Patient</option>
            <option value="doctor">Doctor</option>
          </select>
        </div>
        <button type="submit" className="auth-button">Login</button>
      </form>
      {error && <p className="error-message">{error}</p>}
    </div>
  );
};

export default Login;