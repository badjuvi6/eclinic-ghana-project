import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import Appointments from './Appointments';
import './Dashboard.css';

const PatientDashboard = ({ openBookingModal, fullName }) => {
  const { logout } = useAuth();
  // ... rest of the weather API logic from before
  const [weatherData, setWeatherData] = useState(null);
  const [loadingWeather, setLoadingWeather] = useState(true);

  const API_KEY = "d882cb4248b531ffebe62c1b8e79a8c3";
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
  }, [API_KEY, city, country]);

  return (
    <div className="dashboard-container">
      <div className="dashboard-content">
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