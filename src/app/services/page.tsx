"use client";

import { useState, useEffect, useRef } from "react";
import {
  Search,
  MapPin,
  Wind,
  Droplets,
  Sun,
  Clock,
  RefreshCw,
  Calendar,
  Thermometer,
  CloudSun,
  CloudRain,
  Activity,
} from "lucide-react";
import { useRouter } from "next/navigation";

import { auth } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";

import { incrementWeatherQueries } from "@/lib/analytics";
import {
  fetchLiveWeatherFromApi,
  searchCitiesApi,
  WeatherApiResult,
  AutocompleteSuggestion,
} from "@/lib/weatherApiClient";

export default function ServicesPage() {
  const [locationInput, setLocationInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("Mumbai, Maharashtra");
  const [suggestions, setSuggestions] = useState<AutocompleteSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const suggestionRef = useRef<HTMLDivElement>(null);

  const [weatherData, setWeatherData] = useState<WeatherApiResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [fetchingWeather, setFetchingWeather] = useState(false);
  const router = useRouter();

  /* 🔐 Auth Protection */
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.replace("/auth/login?redirect=/services");
      } else {
        setLoading(false);
      }
    });

    return () => unsub();
  }, [router]);

  /* Geolocation auto-detection on mount */
  useEffect(() => {
    if (typeof window !== "undefined" && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;
          setSearchQuery(`${lat},${lon}`);
        },
        (error) => {
          console.warn("Geolocation permission denied, using default (Mumbai):", error);
        }
      );
    }
  }, []);

  /* Fetch live weather data whenever searchQuery changes */
  useEffect(() => {
    async function loadLiveWeather() {
      try {
        setFetchingWeather(true);
        const data = await fetchLiveWeatherFromApi(searchQuery);
        setWeatherData(data);
      } catch (err) {
        console.error("Error loading weather data on services page:", err);
      } finally {
        setFetchingWeather(false);
      }
    }

    if (!loading) {
      loadLiveWeather();
    }
  }, [searchQuery, loading]);

  /* Autocomplete suggestion search */
  useEffect(() => {
    if (locationInput.trim().length < 2) {
      setSuggestions([]);
      return;
    }
    const delayDebounce = setTimeout(async () => {
      const results = await searchCitiesApi(locationInput);
      setSuggestions(results);
      setShowSuggestions(results.length > 0);
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [locationInput]);

  /* Click outside to dismiss autocomplete list */
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (suggestionRef.current && !suggestionRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  /* Prevent flash before auth check */
  if (loading) {
    return (
      <div className="pt-20 min-h-screen flex items-center justify-center bg-white dark:bg-black">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
          <p className="text-sm font-medium text-gray-500">Checking credentials...</p>
        </div>
      </div>
    );
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!locationInput.trim()) return;

    setSearchQuery(locationInput.trim());
    setShowSuggestions(false);
    setLocationInput("");
    incrementWeatherQueries();
  };

  const handleSuggestionClick = (s: AutocompleteSuggestion) => {
    setSearchQuery(`${s.lat},${s.lon}`);
    setShowSuggestions(false);
    setLocationInput("");
    incrementWeatherQueries();
  };

  return (
    <div className="pt-16 min-h-screen bg-white dark:bg-black text-gray-900 dark:text-white relative">
      {/* Background ambient glows */}
      <div className="absolute top-0 left-1/4 h-[400px] w-[400px] rounded-full bg-blue-500/10 blur-3xl -z-10 pointer-events-none" />
      <div className="absolute top-80 right-1/4 h-[350px] w-[350px] rounded-full bg-yellow-400/10 blur-3xl -z-10 pointer-events-none" />

      {/* HERO SECTION */}
      <section className="py-12 text-center px-6 max-w-7xl mx-auto">
        <h1 className="text-4xl md:text-6xl font-black tracking-tight">
          Live Weather Services
          <span className="block bg-gradient-to-r from-blue-600 to-amber-500 bg-clip-text text-transparent">
            OpenWeatherMap Telemetry
          </span>
        </h1>
        <p className="mt-4 max-w-2xl mx-auto text-sm md:text-base font-semibold text-gray-500 dark:text-gray-400">
          Real-time weather station metrics, air quality indices, wind vectors, and local 24-hour timelines.
        </p>
      </section>

      {/* SEARCH BAR WITH AUTO-COMPLETE */}
      <section className="py-4 px-6 flex justify-center relative z-45 max-w-7xl mx-auto">
        <form
          onSubmit={handleSearch}
          className="w-full flex items-center gap-3 rounded-2xl border border-gray-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/60 backdrop-blur-xl p-3 shadow-lg relative"
        >
          <div className="relative flex-1" ref={suggestionRef}>
            <div className="flex items-center gap-2">
              <Search className="text-gray-400 h-5 w-5 shrink-0" />
              <input
                type="text"
                placeholder="Search city or district (e.g. Pune, Mumbai, Delhi, Nagpur)"
                value={locationInput}
                onChange={(e) => setLocationInput(e.target.value)}
                onFocus={() => setShowSuggestions(suggestions.length > 0)}
                className="w-full bg-transparent outline-none text-sm font-semibold dark:text-white placeholder:text-gray-400"
              />
            </div>

            {/* Suggestions drop down list */}
            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute left-0 right-0 mt-3 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl shadow-2xl z-50 overflow-hidden divide-y divide-slate-100 dark:divide-slate-800/80">
                {suggestions.map((item, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => handleSuggestionClick(item)}
                    className="w-full text-left px-4 py-3 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10 transition-colors flex items-center gap-2"
                  >
                    <MapPin className="h-3.5 w-3.5 text-amber-500 shrink-0" />
                    <span>{item.name}, {item.region} ({item.country})</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={fetchingWeather}
            className="rounded-xl bg-blue-600 px-5 py-2.5 text-xs font-extrabold text-white hover:bg-blue-700 transition active:scale-95 disabled:opacity-50 flex items-center gap-2"
          >
            {fetchingWeather && <RefreshCw className="h-3.5 w-3.5 animate-spin" />}
            Search
          </button>
        </form>
      </section>

      {/* DYNAMIC WOW HERO WEATHER CARD */}
      <section className="py-6 px-6 max-w-7xl mx-auto">
        <div className="w-full rounded-3xl border border-slate-200/50 dark:border-slate-800/80 bg-gradient-to-r from-blue-500/10 to-indigo-500/15 dark:from-blue-950/20 dark:to-indigo-950/30 p-6 md:p-8 backdrop-blur-xl shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-bold text-xs uppercase tracking-widest">
                <MapPin className="h-4 w-4" /> Live Meteorological Station
              </div>
              <h2 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white">
                {fetchingWeather ? "..." : weatherData?.locationName}
              </h2>
              <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">
                {fetchingWeather ? "Resolving region..." : `${weatherData?.region}, ${weatherData?.country}`}
              </p>
            </div>

            {!fetchingWeather && weatherData?.icon && (
              <div className="flex items-center gap-3">
                <div className="h-16 w-16 relative bg-white/20 dark:bg-black/20 rounded-2xl p-2 border border-white/20">
                  <img src={weatherData.icon} alt="Weather Icon" className="h-full w-full object-contain" />
                </div>
                <div>
                  <p className="text-xl font-black text-slate-900 dark:text-white leading-tight">
                    {weatherData.condition}
                  </p>
                  <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                    Feels like: {weatherData.feelsLike}°C
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="flex flex-wrap items-baseline gap-x-6 gap-y-2 pt-2 border-t border-slate-200/40 dark:border-slate-800/40">
            <div className="flex items-baseline gap-1">
              <span className="text-5xl md:text-6xl font-black text-slate-900 dark:text-white">
                {fetchingWeather ? "..." : `${weatherData?.temp}`}
              </span>
              <span className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white">°C</span>
            </div>
            {!fetchingWeather && (
              <div className="text-xs font-bold text-slate-500 dark:text-slate-400 space-y-0.5">
                <p className="flex items-center gap-1">
                  <Thermometer className="h-3.5 w-3.5 text-red-500" /> Max Temp: {weatherData?.maxTemp}°C
                </p>
                <p className="flex items-center gap-1">
                  <Thermometer className="h-3.5 w-3.5 text-blue-500" /> Min Temp: {weatherData?.minTemp}°C
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* METRICS 6-TILE GRID */}
      <section className="py-4 px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
          <ForecastMetricCard
            title="Temp Spectrum"
            value={fetchingWeather ? "..." : `${weatherData?.temp}°C`}
            subtitle={`Feels: ${weatherData?.feelsLike ?? weatherData?.temp}°C`}
            icon={<Thermometer className="h-5 w-5 text-amber-500" />}
          />
          <ForecastMetricCard
            title="Humidity"
            value={fetchingWeather ? "..." : `${weatherData?.humidity ?? 80}%`}
            subtitle="Relative value"
            icon={<Droplets className="h-5 w-5 text-blue-500" />}
          />
          <ForecastMetricCard
            title="Wind Vector"
            value={fetchingWeather ? "..." : `${weatherData?.wind ?? 15} km/h`}
            subtitle={`Dir: ${weatherData?.windDir || "N"}`}
            icon={<Wind className="h-5 w-5 text-sky-400" />}
          />
          <ForecastMetricCard
            title="UV Index"
            value={fetchingWeather ? "..." : `${weatherData?.uvIndex ?? 5}`}
            subtitle={weatherData && weatherData.uvIndex > 5 ? "Moderate Exposure" : "Low Exposure"}
            icon={<Sun className="h-5 w-5 text-yellow-500" />}
          />
          <ForecastMetricCard
            title="Air Quality"
            value={fetchingWeather ? "..." : `${weatherData?.aqiVal ?? 15} PM2.5`}
            subtitle={weatherData?.aqiText || "Good"}
            icon={<Activity className="h-5 w-5 text-emerald-500" />}
          />
          <ForecastMetricCard
            title="Rain Probability"
            value={fetchingWeather ? "..." : `${weatherData?.rainChance ?? 15}%`}
            subtitle="Precipitation"
            icon={<CloudRain className="h-5 w-5 text-indigo-400" />}
          />
        </div>
      </section>

      {/* 24-HOUR FORECAST TIMELINE */}
      <section className="py-6 px-6 max-w-7xl mx-auto">
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 p-5 md:p-6 backdrop-blur-xl shadow-sm space-y-4">
          <h2 className="text-base md:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Clock className="h-5 w-5 text-amber-500" /> 24-Hour Local Hourly Forecast
          </h2>

          {fetchingWeather ? (
            <div className="py-6 text-center text-slate-500 text-xs font-semibold">
              Loading hourly timeline...
            </div>
          ) : (
            <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-thin">
              {weatherData?.hourly?.map((item, i) => (
                <div
                  key={i}
                  className="flex-shrink-0 w-28 rounded-2xl border border-gray-200 dark:border-white/10 bg-white/50 dark:bg-white/5 backdrop-blur-xl p-5 text-center hover:scale-[1.03] transition-transform"
                >
                  <p className="text-xs font-semibold opacity-70">{item.time}</p>
                  <p className="mt-3 text-2xl font-black">{item.temp}°C</p>
                  <p className="mt-1 text-xs text-blue-500 font-semibold">{item.precip}% Rain</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 3-DAY EXTENDED FORECAST */}
      <section className="py-6 px-6 max-w-7xl mx-auto pb-16">
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 p-5 md:p-6 backdrop-blur-xl shadow-sm space-y-4">
          <h2 className="text-base md:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Calendar className="h-5 w-5 text-blue-500" />
            3-Day Extended Outlook
          </h2>

          {fetchingWeather ? (
            <div className="py-6 text-center text-slate-500 text-xs font-semibold">
              Loading outlook...
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {weatherData?.dailyForecasts?.map((day, idx) => (
                <div
                  key={idx}
                  className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 p-4 flex items-center justify-between hover:border-blue-500/30 transition-colors"
                >
                  <div className="space-y-0.5">
                    <p className="text-sm font-black text-slate-900 dark:text-white">
                      {idx === 0 ? "Today" : day.day}
                    </p>
                    <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400">{day.date}</p>
                    <p className="text-xs font-semibold text-slate-600 dark:text-slate-400 mt-1">
                      {day.condition}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    {day.icon && (
                      <div className="h-10 w-10 relative bg-white/20 dark:bg-black/25 rounded-lg p-1">
                        <img src={day.icon} alt="Weather Icon" className="h-full w-full object-contain" />
                      </div>
                    )}
                    <div className="text-right">
                      <p className="text-sm font-black text-slate-900 dark:text-white">
                        {day.maxTemp}°C
                      </p>
                      <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                        {day.minTemp}°C
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

function ForecastMetricCard({
  title,
  value,
  subtitle,
  icon,
}: {
  title: string;
  value: string;
  subtitle: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 p-4 shadow-sm flex flex-col justify-between hover:border-blue-500/30 transition-all duration-200">
      <div className="flex items-center justify-between mb-2">
        <span className="text-[9px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest shrink-0">{title}</span>
        <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shrink-0">{icon}</div>
      </div>
      <div className="overflow-hidden">
        <p className="text-lg font-black text-slate-900 dark:text-white truncate">{value}</p>
        <p className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold mt-0.5 truncate">{subtitle}</p>
      </div>
    </div>
  );
}
