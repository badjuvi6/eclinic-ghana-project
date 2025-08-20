import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import './HomePage.css';

const HomePage = () => {
  const [doctors, setDoctors] = useState([]);

  useEffect(() => {
    const fetchDoctors = async () => {
      const q = query(collection(db, 'users'), where('userType', '==', 'doctor'));
      const querySnapshot = await getDocs(q);
      const doctorsList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setDoctors(doctorsList);
    };
    fetchDoctors();
  }, []);

  return (
    <div className="homepage-container">
      {/* Hero Section */}
      <section className="hero-section">
        <h1>Your Health, Our Priority.</h1>
        <p>Connect with expert doctors from the comfort of your home. Secure, simple, and effective.</p>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <h2>Key Features</h2>
        <div className="features-list">
          <div className="feature-card">
            <h3>Easy Booking</h3>
            <p>Schedule your next appointment in just a few clicks.</p>
          </div>
          <div className="feature-card">
            <h3>Online Consultation</h3>
            <p>Speak with doctors via secure chat or video calls.</p>
          </div>
          <div className="feature-card">
            <h3>Secure Health Records</h3>
            <p>Access your health information anytime, anywhere.</p>
          </div>
        </div>
      </section>

      {/* About Us Section */}
      <section id="about-us" className="about-us-section">
        <h2>About Us</h2>
        <p>eClinic is dedicated to providing accessible and high-quality healthcare to everyone. Our mission is to bridge the gap between patients and medical professionals through a secure and user-friendly digital platform.</p>
      </section>
    </div>
  );
};

export default HomePage;