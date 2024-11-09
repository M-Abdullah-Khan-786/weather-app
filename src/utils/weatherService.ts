import axios from 'axios';
const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;
const BASE_URL = 'https://api.openweathermap.org/data/2.5/';

export const fetchWeather = async (city: string) => {
  const response = await axios.get(
    `${BASE_URL}weather?q=${city}&units=metric&appid=${API_KEY}`
  );
  return response.data;
};

export const fetchForecast = async (city: string) => {
  const response = await axios.get(
    `${BASE_URL}forecast?q=${city}&units=metric&appid=${API_KEY}`
  );
  return response.data;
};

export const fetchWeatherByLocation = async (lat: number, lon: number) => {
  const response = await axios.get(
    `${BASE_URL}weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`
  );
  return response.data;
};
