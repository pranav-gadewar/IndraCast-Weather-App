"use client";

import { useState, useEffect, useRef } from "react";
import {
  CloudSun,
  CloudRain,
  Wind,
  Droplets,
  Thermometer,
  AlertTriangle,
  Send,
  CheckCircle,
  RefreshCw,
  Search,
  MapPin,
  Compass,
  Clock,
  Calendar,
  Activity,
} from "lucide-react";

import { db } from "@/lib/firebase";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";
import { incrementWeatherQueries } from "@/lib/analytics";
import {
  fetchLiveWeatherFromApi,
  searchCitiesApi,
  WeatherApiResult,
  AutocompleteSuggestion,
} from "@/lib/weatherApiClient";

const PRESET_CITIES: Record<string, string> = {
  Mumbai: "Mumbai, Maharashtra, India",
  Nagpur: "Nagpur, Maharashtra, India",
  Pune: "Pune, Maharashtra, India",
  Delhi: "Delhi, India",
  Bengaluru: "Bengaluru, Karnataka, India",
  Kolkata: "Kolkata, West Bengal, India",
  Chennai: "Chennai, Tamil Nadu, India",
  Hyderabad: "Hyderabad, Telangana, India",
  Jaipur: "Jaipur, Rajasthan, India",
  Ahmedabad: "Ahmedabad, Gujarat, India",
};

export default function AdminForecastPage() {
  const [activeTab, setActiveTab] = useState<"search" | "coords" | "preset">("search");
  
  // Active search query (defaults to Mumbai, updated by geolocation on mount)
  const [currentQuery, setCurrentQuery] = useState("Mumbai, Maharashtra, India");
  
  // Search suggestion state
  const [searchQueryInput, setSearchQueryInput] = useState("");
  const [suggestions, setSuggestions] = useState<AutocompleteSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const suggestionRef = useRef<HTMLDivElement>(null);

  // Coordinates state
  const [coordLat, setCoordLat] = useState("19.076");
  const [coordLon, setCoordLon] = useState("72.8777");

  // Weather telemetry state
  const [telemetry, setTelemetry] = useState<WeatherApiResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchError, setSearchError] = useState("");

  // Broadcast Alert state
  const [alertText, setAlertText] = useState("");
  const [alertSent, setAlertSent] = useState(false);

  // Geolocation auto-detection on mount
  useEffect(() => {
    if (typeof window !== "undefined" && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;
          setCurrentQuery(`${lat},${lon}`);
          setCoordLat(lat.toFixed(4));
          setCoordLon(lon.toFixed(4));
        },
        (error) => {
          console.warn("Geolocation permission denied, using default (Mumbai):", error);
        }
      );
    }
  }, []);

  // Fetch live weather from WeatherAPI.com
  useEffect(() => {
    async function loadLiveWeather() {
      try {
        setLoading(true);
        setSearchError("");
        const data = await fetchLiveWeatherFromApi(currentQuery);
        setTelemetry(data);
        incrementWeatherQueries();
      } catch (err: any) {
        console.error("Error fetching WeatherAPI.com telemetry:", err);
        setSearchError("Failed to fetch live weather telemetry.");
      } finally {
        setLoading(false);
      }
    }

    loadLiveWeather();
  }, [currentQuery]);

  // Handle Autocomplete fetch as the user types
  useEffect(() => {
    if (searchQueryInput.trim().length < 2) {
      setSuggestions([]);
      return;
    }
    const delayDebounce = setTimeout(async () => {
      const results = await searchCitiesApi(searchQueryInput);
      setSuggestions(results);
      setShowSuggestions(results.length > 0);
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [searchQueryInput]);

  // Click outside suggestions dropdown handler
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (suggestionRef.current && !suggestionRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Load existing broadcast notice
  useEffect(() => {
    async function loadAlert() {
      try {
        const snap = await getDoc(doc(db, "settings", "broadcast"));
        if (snap.exists()) {
          setAlertText(snap.data().message || "");
        }
      } catch (err) {
        console.warn("Notice doc read notice:", err);
      }
    }
    loadAlert();
  }, []);

  const handleCitySearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQueryInput.trim()) return;
    setCurrentQuery(searchQueryInput.trim());
    setShowSuggestions(false);
    setSearchQueryInput("");
  };

  const handleSuggestionClick = (s: AutocompleteSuggestion) => {
    setCurrentQuery(`${s.lat},${s.lon}`);
    setShowSuggestions(false);
    setSearchQueryInput("");
  };

  const handleCoordsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const lat = parseFloat(coordLat);
    const lon = parseFloat(coordLon);

    if (isNaN(lat) || isNaN(lon) || lat < -90 || lat > 90 || lon < -180 || lon > 180) {
      setSearchError("Please enter valid latitude (-90 to 90) and longitude (-180 to 180).");
      return;
    }

    setCurrentQuery(`${lat},${lon}`);
  };

  const handleSendAlert = async (e: React.FormEvent) => {
    e.preventDefault();
    if (alertText.trim()) {
      try {
        await setDoc(doc(db, "settings", "broadcast"), {
          message: alertText.trim(),
          city: telemetry?.locationName || "Mumbai",
          updatedAt: serverTimestamp(),
          active: true,
        });
        setAlertSent(true);
        setTimeout(() => setAlertSent(false), 4000);
      } catch (err) {
        console.error("Error saving broadcast notice:", err);
      }
    }
  };

  return (
    <div className="space-y-6 md:space-y-8 max-w-7xl mx-auto">
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <CloudSun className="h-7 w-7 text-amber-500" /> Live Weather Forecast Engine
          </h1>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-1">
            WeatherAPI.com high-precision telemetry, geocoded autocomplete search, & daily forecasts.
          </p>
        </div>
      </div>

      {/* LOCATION SELECTION CONTROLS PANEL */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 p-5 backdrop-blur-xl shadow-sm space-y-4 relative">
        <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3 flex-wrap">
          <button
            onClick={() => {
              setActiveTab("search");
              setSearchError("");
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === "search"
                ? "bg-amber-500 text-slate-950 shadow-sm"
                : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
            }`}
          >
            <Search className="h-4 w-4" /> Option 1: Search Any City (India)
          </button>

          <button
            onClick={() => {
              setActiveTab("coords");
              setSearchError("");
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === "coords"
                ? "bg-amber-500 text-slate-950 shadow-sm"
                : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
            }`}
          >
            <Compass className="h-4 w-4" /> Option 2: GPS Coordinates
          </button>

          <button
            onClick={() => {
              setActiveTab("preset");
              setSearchError("");
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === "preset"
                ? "bg-amber-500 text-slate-950 shadow-sm"
                : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
            }`}
          >
            <MapPin className="h-4 w-4" /> Option 3: Presets
          </button>
        </div>

        {/* MODE 1: SEARCH BAR WITH AUTO-COMPLETE */}
        {activeTab === "search" && (
          <form onSubmit={handleCitySearch} className="flex flex-col sm:flex-row gap-3 relative">
            <div className="relative flex-1" ref={suggestionRef}>
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Type city name (e.g. Nagpur, Mumbai, Pune, Delhi, Jaipur)"
                value={searchQueryInput}
                onChange={(e) => setSearchQueryInput(e.target.value)}
                onFocus={() => setShowSuggestions(suggestions.length > 0)}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-sm font-semibold text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-amber-500"
              />

              {/* Autocomplete suggestions dropdown */}
              {showSuggestions && suggestions.length > 0 && (
                <div className="absolute left-0 right-0 mt-2 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl shadow-2xl z-50 overflow-hidden divide-y divide-slate-100 dark:divide-slate-800/80">
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
              className="px-6 py-3 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 transition-colors shadow-sm"
            >
              Search Live Weather
            </button>
          </form>
        )}

        {/* MODE 2: DIRECT COORDINATES */}
        {activeTab === "coords" && (
          <form onSubmit={handleCoordsSubmit} className="flex flex-col sm:flex-row items-center gap-3">
            <div className="w-full sm:w-1/2 flex items-center gap-2">
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400 shrink-0">Lat (°N):</span>
              <input
                type="number"
                step="any"
                required
                placeholder="e.g. 19.0760"
                value={coordLat}
                onChange={(e) => setCoordLat(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-xs font-semibold text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
            <div className="w-full sm:w-1/2 flex items-center gap-2">
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400 shrink-0">Lon (°E):</span>
              <input
                type="number"
                step="any"
                required
                placeholder="e.g. 72.8777"
                value={coordLon}
                onChange={(e) => setCoordLon(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-xs font-semibold text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
            <button
              type="submit"
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 transition-colors shadow-sm shrink-0"
            >
              Fetch Coordinates
            </button>
          </form>
        )}

        {/* MODE 3: PRESETS */}
        {activeTab === "preset" && (
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Select Preset Location:</span>
            <select
              value={currentQuery}
              onChange={(e) => setCurrentQuery(e.target.value)}
              className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-xs font-bold text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-amber-500"
            >
              {Object.keys(PRESET_CITIES).map((key) => (
                <option key={key} value={PRESET_CITIES[key]}>
                  {PRESET_CITIES[key]}
                </option>
              ))}
            </select>
          </div>
        )}

        {searchError && (
          <p className="text-xs font-bold text-red-500 pt-1">{searchError}</p>
        )}
      </div>

      {/* 🌟 WOW HERO WEATHER CARD (Glassmorphism UI) */}
      <div className="rounded-3xl border border-slate-200/50 dark:border-slate-800/80 bg-gradient-to-r from-blue-500/10 to-indigo-500/15 dark:from-blue-950/20 dark:to-indigo-950/30 p-6 md:p-8 backdrop-blur-xl shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-bold text-xs uppercase tracking-widest">
              <MapPin className="h-4 w-4" /> Live Meteorological Station
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white">
              {loading ? "..." : telemetry?.locationName}
            </h2>
            <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">
              {loading ? "Resolving region..." : `${telemetry?.region}, ${telemetry?.country}`}
            </p>
          </div>

          {!loading && telemetry?.icon && (
            <div className="flex items-center gap-3">
              <div className="h-16 w-16 relative bg-white/20 dark:bg-black/20 rounded-2xl p-2 border border-white/20">
                <img src={telemetry.icon} alt="Weather Icon" className="h-full w-full object-contain" />
              </div>
              <div>
                <p className="text-xl font-black text-slate-900 dark:text-white leading-tight">
                  {telemetry.condition}
                </p>
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                  Feels like: {telemetry.feelsLike}°C
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-wrap items-baseline gap-x-6 gap-y-2 pt-2 border-t border-slate-200/40 dark:border-slate-800/40">
          <div className="flex items-baseline gap-1">
            <span className="text-5xl md:text-6xl font-black text-slate-900 dark:text-white">
              {loading ? "..." : `${telemetry?.temp}`}
            </span>
            <span className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white">°C</span>
          </div>
          {!loading && (
            <div className="text-xs font-bold text-slate-500 dark:text-slate-400 space-y-0.5">
              <p className="flex items-center gap-1">
                <Thermometer className="h-3.5 w-3.5 text-red-500" /> Max Temp: {telemetry?.maxTemp}°C
              </p>
              <p className="flex items-center gap-1">
                <Thermometer className="h-3.5 w-3.5 text-blue-500" /> Min Temp: {telemetry?.minTemp}°C
              </p>
            </div>
          )}
        </div>
      </div>

      {/* ENHANCED 6-TILE METRICS GRID */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
        <ForecastMetricCard
          title="Temp Spectrum"
          value={loading ? "..." : `${telemetry?.temp}°C`}
          subtitle={`Feels like: ${telemetry?.feelsLike ?? telemetry?.temp}°C`}
          icon={<Thermometer className="h-5 w-5 text-amber-500" />}
        />
        <ForecastMetricCard
          title="Humidity"
          value={loading ? "..." : `${telemetry?.humidity ?? 80}%`}
          subtitle="Relative humidity"
          icon={<Droplets className="h-5 w-5 text-blue-500" />}
        />
        <ForecastMetricCard
          title="Wind Vector"
          value={loading ? "..." : `${telemetry?.wind ?? 15} km/h`}
          subtitle={`Dir: ${telemetry?.windDir || "N"}`}
          icon={<Wind className="h-5 w-5 text-sky-400" />}
        />
        <ForecastMetricCard
          title="UV Radiation"
          value={loading ? "..." : `${telemetry?.uvIndex ?? 6}`}
          subtitle={telemetry && telemetry.uvIndex > 5 ? "High Exposure" : "Low Exposure"}
          icon={<CloudSun className="h-5 w-5 text-yellow-500" />}
        />
        <ForecastMetricCard
          title="Air Quality (AQI)"
          value={loading ? "..." : `${telemetry?.aqiVal ?? 15} PM2.5`}
          subtitle={telemetry?.aqiText || "Good"}
          icon={<Activity className="h-5 w-5 text-emerald-500" />}
        />
        <ForecastMetricCard
          title="Rain Probability"
          value={loading ? "..." : `${telemetry?.rainChance ?? 15}%`}
          subtitle="Precipitation index"
          icon={<CloudRain className="h-5 w-5 text-indigo-400" />}
        />
      </div>

      {/* 24-HOUR HOURLY FORECAST STRIP */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 p-5 md:p-6 backdrop-blur-xl shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base md:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Clock className="h-5 w-5 text-amber-500" />
            24-Hour Local Hourly Series ({telemetry?.locationName || "Mumbai"})
          </h2>
          <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
            Telemetry Synced
          </span>
        </div>

        {loading ? (
          <div className="py-8 text-center text-slate-500 text-xs font-semibold">
            Fetching hourly forecast data...
          </div>
        ) : (
          <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-thin">
            {telemetry?.hourly?.map((item, index) => (
              <div
                key={index}
                className="flex-shrink-0 w-24 p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/80 text-center space-y-1.5 hover:border-amber-500/40 transition-colors"
              >
                <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400">{item.time}</p>
                <CloudSun className="h-6 w-6 mx-auto text-amber-500" />
                <p className="text-base font-black text-slate-900 dark:text-white">{item.temp}°C</p>
                <p className="text-[10px] font-bold text-blue-500 flex items-center justify-center gap-1">
                  <CloudRain className="h-3 w-3" /> {item.precip}%
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* MULTI-DAY FORECAST GRID */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 p-5 md:p-6 backdrop-blur-xl shadow-sm space-y-4">
        <h2 className="text-base md:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Calendar className="h-5 w-5 text-blue-500" />
          3-Day Extended Regional Outlook
        </h2>

        {loading ? (
          <div className="py-6 text-center text-slate-500 text-xs font-semibold">
            Fetching extended outlook...
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {telemetry?.dailyForecasts?.map((day, idx) => (
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

      {/* BROADCAST ALERT BOX */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-3 rounded-2xl border border-amber-500/30 bg-amber-500/5 p-5 backdrop-blur-xl space-y-4">
          <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400">
            <AlertTriangle className="h-5 w-5" />
            <h3 className="text-base font-bold">Issue Emergency Weather Broadcast Notice</h3>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-300 font-medium">
            Save severe weather broadcast notices to Firestore for display on IndraCast user dashboards.
          </p>

          <form onSubmit={handleSendAlert} className="space-y-3">
            <textarea
              rows={3}
              required
              placeholder={`e.g. Severe thunderstorm warning issued for ${telemetry?.locationName || "Mumbai"} region...`}
              value={alertText}
              onChange={(e) => setAlertText(e.target.value)}
              className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-3 text-xs font-medium dark:text-white outline-none focus:ring-2 focus:ring-amber-500 resize-none"
            />

            {alertSent && (
              <p className="text-xs text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1.5">
                <CheckCircle className="h-4 w-4" /> Broadcast notice saved to Firestore!
              </p>
            )}

            <div className="flex justify-end">
              <button
                type="submit"
                className="flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-amber-500 text-slate-950 text-xs font-extrabold hover:bg-amber-400 transition-colors shadow-sm"
              >
                <Send className="h-4 w-4" /> Broadcast Notice
              </button>
            </div>
          </form>
        </div>
      </div>
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
        <span className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">{title}</span>
        <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">{icon}</div>
      </div>
      <div>
        <p className="text-2xl font-black text-slate-900 dark:text-white">{value}</p>
        <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold mt-0.5">{subtitle}</p>
      </div>
    </div>
  );
}
