import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import './DoctorProfile.css';

const DoctorProfile = ({ onClose }) => {
  const { currentUser } = useAuth();
  const [specialty, setSpecialty] = useState('');
  const [bio, setBio] = useState('');
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      if (currentUser) {
        const docRef = doc(db, 'users', currentUser.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setSpecialty(data.specialty || '');
          setBio(data.bio || '');
        }
      }
      setLoading(false);
    };
    fetchProfile();
  }, [currentUser]);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setMessage('');
    if (currentUser) {
      const docRef = doc(db, 'users', currentUser.uid);
      try {
        await updateDoc(docRef, {
          specialty: specialty,
          bio: bio,
        });
        setMessage('Profile updated successfully!');
      } catch (error) {
        setMessage('Failed to update profile.');
        console.error("Error updating document: ", error);
      }
    }
  };

  if (loading) {
    return <p>Loading profile...</p>;
  }

  return (
    <div className="profile-container">
      <h3>Edit Your Profile</h3>
      <form onSubmit={handleUpdateProfile}>
        <div className="form-group">
          <label>Specialty</label>
          <input
            type="text"
            value={specialty}
            onChange={(e) => setSpecialty(e.target.value)}
            placeholder="e.g., Cardiologist"
            required
          />
        </div>
        <div className="form-group">
          <label>Bio</label>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Tell us about your experience and expertise."
            rows="4"
            required
          ></textarea>
        </div>
        <button type="submit" className="save-button">Save Changes</button>
        <button type="button" onClick={onClose} className="close-button">Close</button>
      </form>
      {message && <p className="message">{message}</p>}
    </div>
  );
};

export default DoctorProfile;