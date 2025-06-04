import React, { useEffect, useState } from "react";
import { ref, set } from "firebase/database";
import { database } from "./firebase";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";


const OPENWEATHER_API_KEY = "ea0e9939a9759606b92e18046de380a9";

const weatherPlaylists = {
  Clear: [
    { id: "1rqqCSm0Qe4I9rUvWncaom", title: "High Hopes - Panic! At The Disco" },
    { id: "0VjIjW4GlUZAMYd2vXMi3b", title: "Blinding Lights - The Weeknd" },
  ],
  Clouds: [
    { id: "3n3Ppam7vgaVa1iaRUc9Lp", title: "Mr. Brightside - The Killers" },
    { id: "7LVHVU3tWfcxj5aiPFEW4Q", title: "Fix You - Coldplay" },
  ],
  Rain: [
    { id: "1zwMYTA5nlNjZxYrvBB2pV", title: "Someone Like You - Adele" },
    { id: "0JmiBCpWc1IAc0et7Xm7FL", title: "Let Her Go - Passenger" },
  ],
  Drizzle: [
    { id: "1lkvpmrCaXK8QtliFDcHBO", title: "Bubbly - Colbie Caillat" },
  ],
  Thunderstorm: [
    { id: "7ouMYWpwJ422jRcDASZB7P", title: "Knights of Cydonia - Muse" },
  ],
  Snow: [
    { id: "6b8Be6ljOzmkOmFslEb23P", title: "Let It Go - Idina Menzel" },
  ],
  default: [
    { id: "3n3Ppam7vgaVa1iaRUc9Lp", title: "Mr. Brightside - The Killers" },
  ],
};

function getWeatherIcon(iconCode) {
  return `https://openweathermap.org/img/wn/${iconCode}@4x.png`;
}

function App() {
  const [city, setCity] = useState("Jakarta");
  const [inputCity, setInputCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    fetchWeather(city);
  }, [city]);

  async function fetchWeather(cityName) {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${OPENWEATHER_API_KEY}&units=metric&lang=id`
      );
      if (!response.ok) throw new Error("Gagal mengambil data cuaca.");
      const data = await response.json();
      setWeather(data);
      await set(ref(database, `weather/${cityName}`), data);

      const forecastResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${OPENWEATHER_API_KEY}&units=metric&lang=id`
      );
      const forecastData = await forecastResponse.json();
      const dailyForecast = forecastData.list.filter(item =>
        item.dt_txt.includes("12:00:00")
      );
      setForecast(dailyForecast);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  function handleSearch(e) {
    e.preventDefault();
    if (inputCity.trim() !== "") {
      setCity(inputCity.trim());
      setInputCity("");
    }
  }

  function toggleDarkMode() {
    setDarkMode(!darkMode);
  }

  const currentWeatherMain = weather?.weather?.[0]?.main;
  const playlistTracks = weatherPlaylists[currentWeatherMain] || weatherPlaylists.default;

  return (
    <div className={`${darkMode ? "dark" : ""} min-h-screen bg-gradient-to-br from-blue-100 to-blue-300 dark:from-gray-900 dark:to-gray-800 transition-colors`}>
      <header className="bg-white dark:bg-gray-900 shadow-md p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 relative">
        <h1 className="text-xl font-bold text-blue-700 dark:text-blue-400">Aplikasi Cuaca</h1>

        <form onSubmit={handleSearch} className="flex w-full sm:w-auto flex-grow sm:flex-grow-0">
          <input
            type="text"
            placeholder="Cari kota..."
            value={inputCity}
            onChange={(e) => setInputCity(e.target.value)}
            className="flex-grow px-4 py-2 rounded-l-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded-r-md hover:bg-blue-700 transition"
          >
            Cari
          </button>
        </form>

        <button
          onClick={toggleDarkMode}
          className="absolute top-4 right-4 text-gray-700 dark:text-gray-300 sm:static sm:ml-4"
          aria-label="Toggle Dark Mode"
        >
          {darkMode ? "🌙" : "☀️"}
        </button>
      </header>

      <main className="flex flex-col lg:flex-row flex-wrap gap-6 p-4">
        {/* Cuaca Saat Ini */}
       <div className="w-full lg:w-1/2 bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-6 text-gray-800 dark:text-gray-100">
  <h2 className="text-2xl font-semibold mb-4">Cuaca di {city}</h2>
  
  {loading && <p>Memuat data...</p>}
  {error && <p className="text-red-600">Terjadi kesalahan: {error}</p>}
  
  {weather && (
  <div className="flex flex-col items-center space-y-6">
    {/* Icon cuaca */}
    <img
      src={getWeatherIcon(weather.weather[0].icon)}
      alt={weather.weather[0].description}
      className="w-32 h-32"
    />

    {/* Info suhu utama di tengah */}
    <h2 className="text-4xl font-bold text-center dark:text-white">
      {weather.main.temp}°C
    </h2>
    <p className="text-lg text-gray-700 dark:text-gray-300 capitalize">
      {weather.weather[0].description}
    </p>

    {/* Info lainnya dalam grid */}
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
      <div className="flex items-center bg-blue-100 dark:bg-gray-800 p-4 rounded-xl shadow">
        <span className="text-2xl mr-3">🌡️</span>
        <p><span className="font-semibold">Suhu:</span> {weather.main.temp} °C</p>
      </div>

      <div className="flex items-center bg-blue-100 dark:bg-gray-800 p-4 rounded-xl shadow">
        <span className="text-2xl mr-3">💧</span>
        <p><span className="font-semibold">Kelembapan:</span> {weather.main.humidity}%</p>
      </div>

      <div className="flex items-center bg-blue-100 dark:bg-gray-800 p-4 rounded-xl shadow">
        <span className="text-2xl mr-3">🌬️</span>
        <p><span className="font-semibold">Angin:</span> {weather.wind.speed} m/s</p>
      </div>

      <div className="flex items-center bg-blue-100 dark:bg-gray-800 p-4 rounded-xl shadow">
        <span className="text-2xl mr-3">📍</span>
        <p><span className="font-semibold">Lokasi:</span> {weather.name}</p>
      </div>
    </div>
  </div>
)}

</div>

        {/* Rekomendasi Lagu */}
        <div className="w-full lg:w-1/2 bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-6 text-gray-800 dark:text-gray-100">
          <h2 className="text-2xl font-semibold mb-4 text-center">Rekomendasi Lagu</h2>
          {playlistTracks.map((track) => (
            <div key={track.id} className="mb-4">
              <h3 className="font-semibold mb-1">{track.title}</h3>
              <iframe
                src={`https://open.spotify.com/embed/track/${track.id}`}
                width="100%"
                height="80"
                allow="encrypted-media"
                title={track.title}
                className="rounded-md"
              ></iframe>
            </div>
          ))}
        </div>

        {/* Grafik Suhu */}
        <div className="w-full lg:w-1/2 bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-6 text-gray-800 dark:text-gray-100">
          <h2 className="text-2xl font-semibold mb-4 text-center">Grafik Suhu 5 Hari</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart
              data={forecast.map(item => ({
                date: new Date(item.dt_txt).toLocaleDateString("id-ID", {
                  day: "numeric", month: "short"
                }),
                temp: item.main.temp,
              }))}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis unit="°C" />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="temp"
                stroke="#3b82f6"
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Ramalan Cuaca */}
        <div className="w-full bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-6 text-gray-800 dark:text-gray-100">
          <h2 className="text-2xl font-semibold mb-4 text-center">Ramalan Cuaca 5 Hari ke Depan</h2>
          <div className="flex space-x-4 overflow-x-auto pb-4">
            {forecast.map((item, index) => (
              <div
                key={index}
                className="min-w-[180px] flex-shrink-0 bg-blue-100 dark:bg-gray-800 p-4 rounded-xl shadow text-center"
              >
                <p className="font-semibold text-sm mb-2">
                  {new Date(item.dt_txt).toLocaleDateString("id-ID", {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                  })}
                </p>
                <img
                  src={getWeatherIcon(item.weather[0].icon)}
                  alt={item.weather[0].description}
                  className="w-16 h-16 mx-auto"
                />
                <p className="capitalize mt-1">{item.weather[0].description}</p>
                <p className="text-sm">Suhu: {item.main.temp}°C</p>
              </div>
            ))}
          </div>
        </div>

        
      </main>

      <footer className="mt-auto p-4 text-center text-gray-600 dark:text-gray-400 bg-white dark:bg-gray-900 shadow-inner">
        &copy; 2025 Aplikasi Cuaca & Musik - dibuat dengan React & Firebase
      </footer>
    </div>
  );
}

export default App;
