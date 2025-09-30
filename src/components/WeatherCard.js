import React from "react";

const WEEKDAYS = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];

const getWindDescription = (windKph) => {
  if (windKph < 10) return "🌬️ Calm";
  if (windKph < 20) return "🍃 A little breezy";
  if (windKph < 30) return "💨 Windy";
  return "🌪️ Very windy";
};

const getHumidityDescription = (humidity) => {
  if (humidity < 30) return "Dry";
  if (humidity < 60) return "Comfortable";
  if (humidity < 80) return "Humid";
  return "Sticky";
};

const getUVDescription = (uv) => {
  if (uv < 3) return "🟢 Low";
  if (uv < 6) return "🟡 Moderate";
  if (uv < 8) return "🟠 High";
  if (uv < 11) return "🔴 Very high";
  return "☠️ Extreme";
};

const getWeatherEmoji = (condition) => {
  const text = condition.toLowerCase();
  if (text.includes("cloud")) return "☁️";
  if (text.includes("rain")) return "🌧️";
  if (text.includes("clear")) return "☀️";
  if (text.includes("snow")) return "❄️";
  if (text.includes("storm") || text.includes("thunder")) return "⛈️";
  return "🌡️";
};

function WeatherCard({ city, data }) {
  if (!data) return null;

  // waktu lokal
  const localTimestamp = (data.dt + data.timezone) * 1000;
  const localDate = new Date(localTimestamp);
  const dayName = WEEKDAYS[localDate.getUTCDay()];
  const hours = localDate.getUTCHours();
  const minutes = localDate.getUTCMinutes();
  const timePart = `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;

  // ambil data dari API
  const temperature = Math.round(data.main.temp);
  const condition = data.weather[0].description;
  const humidity = data.main.humidity;
  const windSpeed = data.wind.speed; // m/s
  const uvIndex = 5; // placeholder karena API ini gak ada UV (butuh One Call API)

  return (
    <div className="weather-card">
      {/* Left */}
      <div className="left">
        <h2>{city}</h2>
        <p>{dayName}, {timePart}</p>
        <h3>{temperature}°C</h3>
        <p>{getWeatherEmoji(condition)} {condition}</p>
      </div>

      {/* Right */}
      <div className="right">
        <p><strong>💧 Humidity:</strong> {humidity}% ({getHumidityDescription(humidity)})</p>
        <p><strong>💨 Wind:</strong> {windSpeed} m/s ({getWindDescription(windSpeed)})</p>
        <p><strong>🔆 UV Index:</strong> {uvIndex} ({getUVDescription(uvIndex)})</p>
      </div>
    </div>
  );
}

export default WeatherCard;
