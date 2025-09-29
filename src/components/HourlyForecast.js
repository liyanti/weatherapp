import React from "react";

export default function HourlyForecast({ data }) {
  if (!data) return null;

  const tz = (data.city && typeof data.city.timezone === "number") ? data.city.timezone : 0;

  return (
    <div className="hourly-forecast">
      <h3>Today Forecast</h3>
      <div className="forecast-container">
        {data.list.slice(0, 8).map((item, index) => {
          const localTimestamp = (item.dt + tz) * 1000;
          const localDate = new Date(localTimestamp);
          const hours = localDate.getUTCHours();
          const label = `${String(hours).padStart(2,'0')}:00`;

          const iconCode = item.weather[0].icon;
          const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;

          return (
            <div key={index} className="forecast-item">
              <p>{label}</p>
              <img src={iconUrl} alt="weather icon" width="50" height="50" />
              <p>{item.weather[0].description}</p>
              <p>{Math.round(item.main.temp)}°C</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
