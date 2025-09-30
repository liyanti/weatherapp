import React, { useState } from 'react';
import './App.css';
import WeatherCard from "./components/WeatherCard";
import HourlyForecast from "./components/HourlyForecast";

const API_KEY = "8f71c810d9e7226c8b0c64102b33b741";

function App() {
  const [city, setCity] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [weatherData, setWeatherData] = useState(null);
  const [forecastData, setForecastData] = useState(null);

  const formatCityName = (name) => {
    if (!name) return "";
    return name
      .toLowerCase()
      .split(" ")
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const fetchWeather = async (cityName) => {
    if (!cityName) {
      alert("Please enter a city name");
      return;
    }

    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(cityName)}&appid=${API_KEY}&units=metric`
      );
      const data = await response.json();

      if (data.cod === 200 || data.cod === "200") {
        setWeatherData(data);
        setSelectedCity(formatCityName(data.name || cityName));

        // fetch forecast (5-day)
        const { lat, lon } = data.coord;
        const forecastResponse = await fetch(
          `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
        );
        const forecastJson = await forecastResponse.json();
        setForecastData(forecastJson);

        // debug
        console.log("=== fetchWeather debug ===");
        console.log("weather dt (UTC seconds):", data.dt);
        console.log("weather timezone offset (sec):", data.timezone, " (hours:", data.timezone/3600, ")");
        console.log("calculated local (UTC view):", new Date((data.dt + data.timezone) * 1000).toUTCString());
        if (forecastJson.city) {
          console.log("forecast.city.timezone:", forecastJson.city.timezone);
        }
      } else {
        alert("City not found!");
      }
    } catch (error) {
      console.error("Error fetching weather:", error);
      alert("Error fetching weather. Check console for details.");
    }
  };

  //default baground
  const getBackgroundClass = () => {
    if (!weatherData) return "app-container default-bg";

    const localTimestamp = (weatherData.dt + weatherData.timezone) * 1000;
    const localDate = new Date(localTimestamp);
    const localHour = localDate.getUTCHours();

    // debug
    console.log("=== Background Debug ===");
    console.log("dt (UTC):", weatherData.dt, "->", new Date(weatherData.dt * 1000).toUTCString());
    console.log("timezone offset (sec):", weatherData.timezone, " (hrs:", weatherData.timezone / 3600, ")");
    console.log("localTimestamp (ms):", localTimestamp, " -> localDate UTC str:", localDate.toUTCString());
    console.log("localHour (UTC getter on adjusted ts):", localHour);

    if (localHour >= 6 && localHour < 18) {
      return "app-container day-bg"; 
    } else {
      return "app-container night-bg"; 
    }
  };

  return (
    <div className={getBackgroundClass()}> 
      <h1>🌤️ Weather Dashboard</h1>
      <div className='search-bar'>
        <input
          type="text"
          placeholder="Enter city name"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') fetchWeather(city); }}
        />
        <button onClick={() => fetchWeather(city)}>Search</button>
      </div>

      <WeatherCard city={selectedCity} data={weatherData} />
      {forecastData && <HourlyForecast data={forecastData} />}
    </div>
  );
}

export default App;
