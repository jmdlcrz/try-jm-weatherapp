import React, { useState } from "react";

// Icons
const SunIcon = () => (
  <svg
    width="80"
    height="80"
    viewBox="0 0 64 64"
    fill="orange"
    xmlns="http://www.w3.org/2000/svg"
    className="mx-auto"
  >
    <circle cx="32" cy="32" r="14" />
    <g stroke="orange" strokeWidth="4" strokeLinecap="round">
      <line x1="32" y1="2" x2="32" y2="14" />
      <line x1="32" y1="50" x2="32" y2="62" />
      <line x1="2" y1="32" x2="14" y2="32" />
      <line x1="50" y1="32" x2="62" y2="32" />
      <line x1="12" y1="12" x2="20" y2="20" />
      <line x1="44" y1="44" x2="52" y2="52" />
      <line x1="12" y1="52" x2="20" y2="44" />
      <line x1="44" y1="20" x2="52" y2="12" />
    </g>
  </svg>
);

const RainIcon = () => (
  <svg
    width="80"
    height="80"
    viewBox="0 0 64 64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="mx-auto"
  >
    <ellipse cx="32" cy="24" rx="20" ry="14" fill="#7ec8f5" />
    <line
      x1="20"
      y1="40"
      x2="20"
      y2="56"
      stroke="#0077be"
      strokeWidth="4"
      strokeLinecap="round"
    />
    <line
      x1="32"
      y1="40"
      x2="32"
      y2="56"
      stroke="#0077be"
      strokeWidth="4"
      strokeLinecap="round"
    />
    <line
      x1="44"
      y1="40"
      x2="44"
      y2="56"
      stroke="#0077be"
      strokeWidth="4"
      strokeLinecap="round"
    />
  </svg>
);

const PlaceholderIcon = () => (
  <svg
    width="40"
    height="40"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="mx-auto mb-4"
  >
    <path
      d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"
      stroke="red"
      strokeWidth="2"
      fill="red"
    />
    <circle cx="12" cy="9" r="2.5" fill="white" />
  </svg>
);

const WeatherApp = () => {
  const [city, setCity] = useState("");
  const [weatherData, setWeatherData] = useState(null);
  const [error, setError] = useState("");

  const API_KEY = "yw94n347l3yv9i6nb8dfszydit46a8mgo23hvgdt";

  const handleInputChange = (e) => setCity(e.target.value);

  const fetchPlaceId = async (cityName) => {
    const response = await fetch(
      `https://www.meteosource.com/api/v1/free/find_places?text=${encodeURIComponent(
        cityName
      )}&key=${API_KEY}`
    );
    if (!response.ok) throw new Error("Failed to find place");

    const places = await response.json();
    const phPlace = places.find(
      (place) => place.country.toLowerCase() === "philippines"
    );
    if (!phPlace) throw new Error("City not found in the Philippines");

    return phPlace.place_id;
  };

  const handleFetchWeather = async () => {
    if (!city.trim()) {
      setError("Please enter a city name.");
      setWeatherData(null);
      return;
    }

    setError(""); // Keep previous weather visible while fetching

    try {
      const placeId = await fetchPlaceId(city.trim());

      const response = await fetch(
        `https://www.meteosource.com/api/v1/free/point?place_id=${encodeURIComponent(
          placeId
        )}&key=${API_KEY}&units=metric&language=en`
      );

      if (!response.ok) {
        setError("Failed to fetch weather data. Please try again.");
        return; // Optionally, you can clear weatherData here
      }

      const data = await response.json();

      setWeatherData({
        name: city.trim(),
        temp: data.current.temperature,
        condition: data.current.summary,
        humidity: data.current.humidity,
        wind: data.current.wind.speed,
      });
    } catch (err) {
      setError(err.message || "An error occurred while fetching data.");

    }
  };

  const renderWeatherIcon = () => {
    if (weatherData) {
      const condition = weatherData.condition.toLowerCase();
      if (condition.includes("rain") || condition.includes("shower")) {
        return <RainIcon />;
      }
      return <SunIcon />;
    }
    return <PlaceholderIcon />;
  };

  const renderPlaceholderMessage = () => {
    if (!weatherData && !error) {
      return (
        <p className="text-gray-500 text-lg mb-5">
          Search a city in the Philippines to know the weather.
        </p>
      );
    }
    return null;
  };

  const getBackgroundClass = () => {
    if (!weatherData) return "bg-default"; // default before any data
    const condition = weatherData.condition.toLowerCase();

    if (condition.includes("rain") || condition.includes("shower") || condition.includes("drizzle"))
      return "bg-rainy";

    if (condition.includes("sun") || condition.includes("clear"))
      return "bg-sunny";

    return "bg-default";
  };

  return (
    <div className={`min-h-screen flex items-center justify-center p-6 ${getBackgroundClass()}`}>
      <div className="bg-white max-w-md w-full rounded-2xl shadow-lg p-8 text-center font-sans">
        <header className="flex flex-col items-center mb-8">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/9/99/Flag_of_the_Philippines.svg/96px-Flag_of_the_Philippines.svg.png"
            alt="Philippines Flag"
            className="w-24 h-16 rounded-md shadow-md mb-4"
          />
          <h1 className="text-3xl font-extrabold text-gray-800">
            Philippine Weather App
          </h1>
        </header>

        <div className="mb-4 min-h-[120px] flex flex-col items-center justify-center">
          {renderWeatherIcon()}
          {renderPlaceholderMessage()}
        </div>

        <input
          type="text"
          placeholder="Enter city (e.g. Manila)"
          value={city}
          onChange={handleInputChange}
          className="w-full px-4 py-3 mb-4 text-lg border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
        />

        <button
          onClick={handleFetchWeather}
          className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
        >
          Get Weather
        </button>

        {error && <p className="mt-4 text-red-600 font-semibold">{error}</p>}

        {weatherData && (
          <div className="mt-8 text-left text-gray-700 space-y-2">
            <h2 className="text-2xl font-bold">{weatherData.name}</h2>
            <p>
              <span className="font-semibold">Temperature:</span>{" "}
              {weatherData.temp} °C
            </p>
            <p>
              <span className="font-semibold">Condition:</span>{" "}
              {weatherData.condition}
            </p>
            <p>
              <span className="font-semibold">Humidity:</span>{" "}
              {weatherData.humidity} %
            </p>
            <p>
              <span className="font-semibold">Wind Speed:</span>{" "}
              {weatherData.wind.toFixed(2)} m/s
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default WeatherApp;
