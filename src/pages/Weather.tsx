import React, { useState, useEffect } from 'react';
import { fetchWeather, fetchForecast, fetchWeatherByLocation } from '../utils/weatherService';
import { FiSearch } from 'react-icons/fi';

interface WeatherData {
  main: {
    temp: number;
    humidity: number;
    pressure: number;
  };
  weather: {
    description: string;
    icon: string;
  }[];
  name: string;
}

interface ForecastData {
  list: {
    dt_txt: string;
    main: {
      temp: number;
    };
    weather: {
      description: string;
    }[];
  }[];
}

const Weather: React.FC = () => {
  const [city, setCity] = useState<string>('Lahore');
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [forecast, setForecast] = useState<ForecastData | null>(null);
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const fetchWeatherData = async (city: string) => {
    try {
      setLoading(true);
      const weatherData = await fetchWeather(city);
      const forecastData = await fetchForecast(city);
      setWeather(weatherData);
      setForecast(forecastData);
      setError('');
    } catch (err) {
      setError('City not found or API error');
      setWeather(null);
      setForecast(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    if (city.trim()) {
      fetchWeatherData(city);
    }
  };

  const getWeatherByGeolocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const { latitude, longitude } = position.coords;
        const weatherData = await fetchWeatherByLocation(latitude, longitude);
        const forecastData = await fetchForecast(city);
        setWeather(weatherData);
        setForecast(forecastData);
      });
    }
  };

  useEffect(() => {
    fetchWeatherData(city);
  }, [city]);

  return (
    <div className="weather-container">
      <h1>Weather App</h1>
      <div className="search-bar">
        <input
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="Search for a city"
        />
        <button onClick={handleSearch}>
          <FiSearch />
        </button>
        <button onClick={getWeatherByGeolocation}>Use My Location</button>
      </div>
      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}
      {weather && (
        <div className="weather-info">
          <h2>{weather.name}</h2>
          <img
            src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}.png`}
            alt={weather.weather[0].description}
          />
          <p>{weather.weather[0].description}</p>
          <p>Temperature: {weather.main.temp}°C</p>
          <p>Humidity: {weather.main.humidity}%</p>
          <p>Pressure: {weather.main.pressure} hPa</p>
        </div>
      )}
      {forecast && (
        <div className="forecast">
          <h3>Forecast</h3>
          <div className="forecast-list">
            {forecast.list.slice(0, 5).map((item, index) => (
              <div key={index} className="forecast-item">
                <p>{new Date(item.dt_txt).toLocaleTimeString()}</p>
                <p>{item.weather[0].description}</p>
                <p>{item.main.temp}°C</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Weather;