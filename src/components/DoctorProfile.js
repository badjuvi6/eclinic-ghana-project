import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import './DoctorProfile.css';

const DoctorProfile = () => {
  const { currentUser } = useAuth();
  const [bio, setBio] = useState('');
  const [specialty, setSpecialty] = useState('');
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      if (currentUser) {
        const docRef = doc(db, 'users', currentUser.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setBio(data.bio || '');
          setSpecialty(data.specialty || '');
        }
      }
      setLoading(false);
    };
    fetchProfile();
  }, [currentUser]);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    if (!currentUser) {
      setMessage('You must be logged in to update your profile.');
      return;
    }

    try {
      const docRef = doc(db, 'users', currentUser.uid);
      await updateDoc(docRef, {
        bio: bio,
        specialty: specialty,
      });
      setMessage('Profile updated successfully!');
    } catch (error) {
      console.error("Error updating profile: ", error);
      setMessage('Failed to update profile.');
    }
  };

  if (loading) {
    return <p>Loading profile...</p>;
  }

  return (
    <div className="profile-container">
      <h3>Edit Your Profile</h3>
      <form onSubmit={handleUpdateProfile} className="profile-form">
        <label>
          Specialty:
          <input
            type="text"
            value={specialty}
            onChange={(e) => setSpecialty(e.target.value)}
            placeholder="e.g., General Practitioner, Cardiologist"
          />
        </label>
        <label>
          Bio:
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Write a brief bio about yourself..."
          ></textarea>
        </label>
        <button type="submit" className="save-profile-button">Save Profile</button>
      </form>
      {message && <p className="profile-message">{message}</p>}
    </div>
  );
};

export default DoctorProfile;