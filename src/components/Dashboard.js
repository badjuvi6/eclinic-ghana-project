import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import Appointments from './Appointments';
import './Dashboard.css';

const PatientDashboard = ({ openBookingModal, fullName, openChatList }) => {
  const [weatherData, setWeatherData] = useState(null);
  const [loadingWeather, setLoadingWeather] = useState(true);

  const API_KEY = "YOUR_API_KEY_HERE";
  const city = "Accra";
  const country = "GH";

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city},${country}&appid=${API_KEY}&units=metric`);
        const data = await response.json();
        setWeatherData(data);
        setLoadingWeather(false);
      } catch (error) {
        console.error("Failed to fetch weather data:", error);
        setLoadingWeather(false);
      }
    };
    fetchWeather();
  }, []);

  return (
    <div className="dashboard-container">
      <div className="dashboard-content">
        <div className="dashboard-header">
          <h2>Welcome, {fullName}!</h2>
          <button onClick={openChatList} className="chat-button">Open Chats</button>
        </div>
        <div className="weather-widget">
          {loadingWeather ? (
            <p>Loading weather data...</p>
          ) : weatherData ? (
            <div>
              <h3>Weather in {weatherData.name}</h3>
              <p>{weatherData.weather[0].description}</p>
              <p>Temperature: {Math.round(weatherData.main.temp)}°C</p>
            </div>
          ) : (
            <p>Failed to load weather data.</p>
          )}
        </div>
        <Appointments openBookingModal={openBookingModal} />
      </div>
    </div>
  );
};

export default PatientDashboard;