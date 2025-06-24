import { useEffect, useState } from "react";
import { ref, set } from "firebase/database";
import { database } from "./firebase";
import { Swiper, SwiperSlide } from "swiper/react";
import WeatherMap from "./components/WeatherMap";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
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
    { id: "0VjIjW4GlUZAMYd2vXMi3b", title: "Blinding Lights – The Weeknd" }, // :contentReference[oaicite:1]{index=1}
    { id: "1rqqCSm0Qe4I9rUvWncaom", title: "High Hopes – Panic! At The Disco" },
    { id: "6sy3LkhNFjJWlaeSMNwQ62", title: "Counting Stars – OneRepublic" }, // :contentReference[oaicite:2]{index=2}
    { id: "1f6O0LJc8URoZCeaN5ZCDU", title: "Good Life – OneRepublic" },
    { id: "0Af4H1XaQdWK9wO1qYtYUz", title: "Happy – Pharrell Williams" },
  ],
  Clouds: [
    { id: "3n3Ppam7vgaVa1iaRUc9Lp", title: "Mr. Brightside – The Killers" },
    { id: "7LVHVU3tWfcxj5aiPFEW4Q", title: "Fix You – Coldplay" },
    { id: "5ya2gsaIhTkAuWYEMB0nw5", title: "Demons – Imagine Dragons" },
    { id: "0nbXyq5TXYPCO7pr3N8S4I", title: "Radioactive – Imagine Dragons" },
    {
      id: "6c6T1YQk3LJ3FQx1nFsgbN",
      title: "Sweater Weather – The Neighbourhood",
    },
  ],
  Rain: [
    { id: "1zwMYTA5nlNjZxYrvBB2pV", title: "Someone Like You – Adele" },
    { id: "0JmiBCpWc1IAc0et7Xm7FL", title: "Let Her Go – Passenger" },
    { id: "3KkXRkHbMCARz0aVfEt68P", title: "Sunflower – Post Malone" },
    { id: "1zB4vmk8tFRmM9UULNzbLB", title: "Lovely – Billie Eilish & Khalid" },
    { id: "0rKtyWc8bvkriBthvHKY8d", title: "All of Me – John Legend" },
  ],
  Drizzle: [
    { id: "1lkvpmrCaXK8QtliFDcHBO", title: "Bubbly - Colbie Caillat" },
    { id: "2PpruBYCo4H7WOBJ7Q2EwM", title: "I'm Yours - Jason Mraz" },
    { id: "4TnjEaWOeW0eKTKIEvJyCa", title: "Banana Pancakes - Jack Johnson" },
    {
      id: "5nNmj1cLH3r4aA4XDJ2bgY",
      title: "Best Part - Daniel Caesar ft. H.E.R.",
    },
    {
      id: "3AJwUDP919kvQ9QcozQPxg",
      title: "Just The Way You Are - Bruno Mars",
    },
  ],
  Thunderstorm: [
    { id: "7ouMYWpwJ422jRcDASZB7P", title: "Knights of Cydonia - Muse" },
    { id: "3YRCqOhFifThpSRFJ1VWFM", title: "Believer - Imagine Dragons" },
    {
      id: "2dLLR6qlu5UJ5gk0dKz0h3",
      title: "Seven Nation Army - The White Stripes",
    },
    { id: "3AJwUDP919kvQ9QcozQPxg", title: "Viva La Vida - Coldplay" },
    {
      id: "3ZOEytgrvLwQaqXreDs2Jx",
      title: "Smells Like Teen Spirit - Nirvana",
    },
  ],
  Snow: [
    { id: "6b8Be6ljOzmkOmFslEb23P", title: "Let It Go - Idina Menzel" },
    {
      id: "6SlB2yzPnk7r0zY2P2cxEc",
      title: "Sweater Weather - The Neighbourhood",
    },
    { id: "2PpruBYCo4H7WOBJ7Q2EwM", title: "I'm Yours - Jason Mraz" },
    {
      id: "6mFkJmJqdDVQ1REhVfGgd1",
      title: "Snow (Hey Oh) - Red Hot Chili Peppers",
    },
    {
      id: "1VdZ0vKfR5jneCmWIUAMxK",
      title: "Winter Song - Sara Bareilles & Ingrid Michaelson",
    },
  ],
  default: [
    { id: "3n3Ppam7vgaVa1iaRUc9Lp", title: "Mr. Brightside - The Killers" },
    { id: "7qiZfU4dY1lWllzX7mPBI3", title: "Shape of You - Ed Sheeran" },
    { id: "2d8JP84HNLKhmd6IYOoupQ", title: "Memories - Maroon 5" },
    {
      id: "6QgjcU0zLnzq5OrUoSZ3OK",
      title: "What Makes You Beautiful - One Direction",
    },
    {
      id: "4cOdK2wGLETKBW3PvgPWqT",
      title: "Never Gonna Give You Up - Rick Astley",
    },
  ],
};

const weatherActivities = {
  Clear: "☀️ Nikmati hari cerah dengan berjalan-jalan.",
  Rain: "🌧️ Bawa payung dan kerja dari dalam ruangan.",
  Clouds: "☁️ Cocok untuk bekerja di coworking space.",
  Snow: "❄️ WFH dan nikmati secangkir kopi hangat.",
  Thunderstorm: "⚡ Hindari bepergian, tetap produktif di rumah.",
  Mist: "🌫️ Waspada kabut, tetap produktif di rumah.",
  Haze: "🌁 Suasana tenang, cocok untuk kerja ringan.",
  Fog: "🌁 Kurangi aktivitas luar ruang, jaga fokus.",
  Drizzle: "🌦️ Hujan ringan cocok untuk tugas-tugas ringan.",
  Smoke: "🚬 Kurangi aktivitas di luar ruangan.",
  default: "🌀 Gunakan waktumu dengan bijak hari ini.",
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
      const dailyForecast = forecastData.list.filter((item) =>
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
  const playlistTracks =
    weatherPlaylists[currentWeatherMain] || weatherPlaylists.default;

  return (
    <div
      className={`${
        darkMode ? "dark" : ""
      } min-h-screen bg-gradient-to-br from-blue-100 to-blue-300 dark:from-gray-900 dark:to-gray-800 transition-colors`}
    >
      <header className="bg-white dark:bg-gray-900 shadow-md p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 relative">
        <h1 className="text-xl font-bold text-blue-700 dark:text-blue-400">
          Aplikasi Cuaca
        </h1>

        <form
          onSubmit={handleSearch}
          className="flex w-full sm:w-auto flex-grow sm:flex-grow-0"
        >
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

      <main className="flex flex-col gap-6 p-4">
        {/* Cuaca & Saran Aktivitas */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Cuaca Saat Ini */}
          <div className="w-full lg:w-1/2 bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-6 text-gray-800 dark:text-gray-100">
            <h2 className="text-2xl font-semibold mb-4">Cuaca di {city}</h2>
            {loading && <p>Memuat data...</p>}
            {error && (
              <p className="text-red-600">Terjadi kesalahan: {error}</p>
            )}

            {weather && (
              <div className="flex flex-col items-center space-y-6">
                <img
                  src={getWeatherIcon(weather.weather[0].icon)}
                  alt={weather.weather[0].description}
                  className="w-32 h-32"
                />
                <h2 className="text-4xl font-bold text-center dark:text-white">
                  {weather.main.temp}°C
                </h2>
                <p className="text-lg text-gray-700 dark:text-gray-300 capitalize">
                  {weather.weather[0].description}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
                  <div className="flex items-center bg-blue-100 dark:bg-gray-800 p-4 rounded-xl shadow">
                    <span className="text-2xl mr-3">🌡️</span>
                    <p>
                      <span className="font-semibold">Suhu:</span>{" "}
                      {weather.main.temp} °C
                    </p>
                  </div>
                  <div className="flex items-center bg-blue-100 dark:bg-gray-800 p-4 rounded-xl shadow">
                    <span className="text-2xl mr-3">💧</span>
                    <p>
                      <span className="font-semibold">Kelembapan:</span>{" "}
                      {weather.main.humidity}%
                    </p>
                  </div>
                  <div className="flex items-center bg-blue-100 dark:bg-gray-800 p-4 rounded-xl shadow">
                    <span className="text-2xl mr-3">🌬️</span>
                    <p>
                      <span className="font-semibold">Angin:</span>{" "}
                      {weather.wind.speed} m/s
                    </p>
                  </div>
                  <div className="flex items-center bg-blue-100 dark:bg-gray-800 p-4 rounded-xl shadow">
                    <span className="text-2xl mr-3">📍</span>
                    <p>
                      <span className="font-semibold">Lokasi:</span>{" "}
                      {weather.name}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Saran Aktivitas */}
          <div className="w-full lg:w-1/2 flex flex-col">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-gray-800 dark:to-gray-900 rounded-2xl shadow-xl p-20 text-gray-800 dark:text-gray-100 h-full">
              <h2 className="text-2xl font-semibold mb-6 text-center text-blue-700 dark:text-blue-300">
                Saran Aktivitas Profesional
              </h2>
              {weather?.weather?.[0]?.main ? (
                <div className="flex flex-col items-center space-y-6">
                  {(() => {
                    const condition = weather.weather[0].main || "default";
                    const rawSuggestion =
                      weatherActivities[condition] || weatherActivities.default;
                    const emoji = rawSuggestion.charAt(0);
                    const suggestionText = rawSuggestion.slice(2);
                    return (
                      <>
                        <div className="text-6xl animate-bounce drop-shadow-sm">
                          {emoji}
                        </div>
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md px-6 py-4 w-full text-center">
                          <p className="text-lg leading-relaxed font-medium text-gray-700 dark:text-gray-200">
                            {suggestionText}
                          </p>
                        </div>
                      </>
                    );
                  })()}
                </div>
              ) : (
                <p className="text-center text-gray-500 dark:text-gray-400 italic">
                  Saran akan muncul setelah data cuaca tersedia.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* === Peta & Lagu === */}
        <div className="grid lg:grid-cols-2 gap-6 items-start">
          {/* Peta */}
          {weather?.coord?.lat && weather?.coord?.lon && (
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-6 text-gray-800 dark:text-gray-100">
              <h2 className="text-2xl font-semibold mb-4 text-center text-blue-600 dark:text-blue-300">
                Lokasi di Peta
              </h2>
              <WeatherMap
                lat={weather.coord.lat}
                lon={weather.coord.lon}
                city={weather.name}
              />
            </div>
          )}

          {/* Rekomendasi Lagu */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-8 pt-15 text-gray-800 dark:text-gray-100 max-h-[400px] overflow-y-auto">
            <h2 className="text-2xl font-semibold mb-4 text-center">
              Rekomendasi Lagu
            </h2>
            <div className="space-y-4">
              {playlistTracks.map((track) => (
                <div key={track.id} className="mb-2">
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
          </div>
        </div>

        {/* Grafik Suhu */}
        <div className="w-full bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-6 text-gray-800 dark:text-gray-100">
          <h2 className="text-2xl font-semibold mb-4 text-center">
            Grafik Suhu 5 Hari
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart
              data={forecast.map((item) => ({
                date: new Date(item.dt_txt).toLocaleDateString("id-ID", {
                  day: "numeric",
                  month: "short",
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
          <h2 className="text-2xl font-semibold mb-6 text-center">
            Ramalan Cuaca 5 Hari ke Depan
          </h2>
          <Swiper
            modules={[Navigation, Pagination]}
            spaceBetween={20}
            slidesPerView={1}
            navigation
            pagination={{ clickable: true }}
            breakpoints={{
              640: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
              1280: { slidesPerView: 4 },
              1536: { slidesPerView: 5 },
            }}
            className="pb-8"
          >
            {forecast.map((item, index) => (
              <SwiperSlide key={index}>
                <div className="bg-blue-100 dark:bg-gray-800 p-4 rounded-xl shadow-md hover:shadow-xl transition duration-300 text-center">
                  <p className="font-medium text-sm text-gray-700 dark:text-gray-300 mb-2">
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
                  <p className="capitalize mt-2 text-gray-800 dark:text-gray-200 text-sm">
                    {item.weather[0].description}
                  </p>
                  <p className="text-sm mt-1 text-gray-700 dark:text-gray-300">
                    Suhu: {item.main.temp.toFixed(1)}°C
                  </p>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </main>

      <footer className="mt-12 px-4 py-6 text-center text-sm text-gray-600 dark:text-gray-400 bg-white dark:bg-gray-900 shadow-inner">
        <p className="font-semibold text-gray-700 dark:text-gray-200">
          &copy; {new Date().getFullYear()} Aplikasi Cuaca
        </p>
        <p className="mt-1">
          Data diambil dari
          <span className="inline-flex items-center gap-1 font-medium text-blue-600 dark:text-blue-400">
            OpenWeatherMap API
            <img
              src="https://openweathermap.org/themes/openweathermap/assets/vendor/owm/img/icons/logo_60x60.png"
              alt="OpenWeatherMap"
              className="w-5 h-5"
            />
          </span>
        </p>
      </footer>
    </div>
  );
}

export default App;
