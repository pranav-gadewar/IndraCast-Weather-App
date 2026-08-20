export interface HourlyForecastItem {
  time: string;
  temp: number;
  precip: number;
  condition: string;
}

export interface DailyForecastItem {
  day: string;
  date: string;
  maxTemp: number;
  minTemp: number;
  rainChance: number;
  condition: string;
  icon: string;
}

export interface WeatherApiResult {
  locationName: string;
  region: string;
  country: string;
  lat: number;
  lon: number;
  temp: number;
  feelsLike: number;
  minTemp: number;
  maxTemp: number;
  humidity: number;
  wind: number; // km/h
  windDir: string;
  rainChance: number;
  uvIndex: number;
  aqiText: string;
  aqiVal: number;
  condition: string;
  icon: string;
  source: string;
  hourly: HourlyForecastItem[];
  dailyForecasts: DailyForecastItem[];
}

export interface AutocompleteSuggestion {
  name: string;
  region: string;
  country: string;
  lat: number;
  lon: number;
}

const API_KEY = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY || "669de96f3d301cc81c419db92928b7d2";

const OWM_AQI_SCALE: Record<number, string> = {
  1: "Good",
  2: "Fair",
  3: "Moderate",
  4: "Poor",
  5: "Very Poor",
};

// Geocode suggestions using OpenWeather Geocoding API
async function geocodeOpenWeather(query: string): Promise<AutocompleteSuggestion[]> {
  const queryStr = query.includes(",") ? query : `${query},IN`;
  const url = `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(queryStr)}&limit=5&appid=${API_KEY}`;
  
  const res = await fetch(url);
  if (!res.ok) return [];
  const data = await res.json();
  if (Array.isArray(data)) {
    return data.map((item: any) => ({
      name: item.name,
      region: item.state || item.country,
      country: item.country,
      lat: item.lat,
      lon: item.lon,
    }));
  }
  return [];
}

// Autocomplete wrapper mapping to OWM Geocoder
export async function searchCitiesApi(query: string): Promise<AutocompleteSuggestion[]> {
  if (!query || query.trim().length < 2) return [];
  return geocodeOpenWeather(query);
}

// Fetch live weather details from OpenWeather API endpoints
export async function fetchLiveWeatherFromApi(query: string): Promise<WeatherApiResult> {
  let lat = 19.076;
  let lon = 72.8777;
  let locName = "Mumbai";
  let locRegion = "Maharashtra";
  let locCountry = "IN";

  // Check if query is GPS coordinate string
  const parts = query.split(",");
  if (parts.length === 2 && !isNaN(parseFloat(parts[0])) && !isNaN(parseFloat(parts[1]))) {
    lat = parseFloat(parts[0]);
    lon = parseFloat(parts[1]);
    locName = `GPS Location`;
    locRegion = `${lat.toFixed(2)}°, ${lon.toFixed(2)}°`;
    locCountry = "IN";
  } else {
    const suggestions = await geocodeOpenWeather(query);
    if (suggestions.length > 0) {
      const s = suggestions[0];
      lat = s.lat;
      lon = s.lon;
      locName = s.name;
      locRegion = s.region;
      locCountry = s.country;
    }
  }

  // OWM Current, Forecast and Air Pollution Endpoints
  const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`;
  const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`;
  const pollutionUrl = `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${API_KEY}`;

  const [weatherRes, forecastRes, pollutionRes] = await Promise.all([
    fetch(weatherUrl),
    fetch(forecastUrl),
    fetch(pollutionUrl),
  ]);

  if (!weatherRes.ok) {
    throw new Error(`OpenWeather returned status ${weatherRes.status}`);
  }

  const weatherData = await weatherRes.ok ? await weatherRes.json() : {};
  const forecastData = forecastRes.ok ? await forecastRes.json() : {};
  const pollutionData = pollutionRes.ok ? await pollutionRes.json() : {};

  // Current Parameters
  const temp = Math.round(weatherData.main?.temp ?? 27);
  const feelsLike = Math.round(weatherData.main?.feels_like ?? temp);
  const minTemp = Math.round(weatherData.main?.temp_min ?? temp - 3);
  const maxTemp = Math.round(weatherData.main?.temp_max ?? temp + 4);
  const humidity = weatherData.main?.humidity ?? 80;
  const windKph = Math.round((weatherData.wind?.speed || 0) * 3.6); // Convert m/s to km/h

  // Resolve Wind Compass Direction from wind degrees
  const degrees = weatherData.wind?.deg ?? 0;
  const compassDirections = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"];
  const val = Math.floor((degrees / 22.5) + 0.5);
  const windDir = compassDirections[val % 16];

  const condition = weatherData.weather?.[0]?.main || "Clouds";
  const iconCode = weatherData.weather?.[0]?.icon || "03d";
  const icon = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;

  // Air Pollution AQI details
  const aqiIndex = pollutionData.list?.[0]?.main?.aqi || 1;
  const aqiText = OWM_AQI_SCALE[aqiIndex] || "Good";
  const aqiVal = Math.round(pollutionData.list?.[0]?.components?.pm2_5 || 15);

  // Hourly Forecast Series Items (Parse next 8 intervals -> 24 hours)
  const hourly: HourlyForecastItem[] = [];
  const list = forecastData.list || [];

  list.slice(0, 8).forEach((item: any, idx: number) => {
    const dateObj = new Date(item.dt * 1000);
    const timeStr = dateObj.toLocaleTimeString("en-US", {
      hour: "numeric",
      hour12: true,
    });

    hourly.push({
      time: idx === 0 ? "Now" : timeStr,
      temp: Math.round(item.main?.temp),
      precip: Math.round((item.pop || 0) * 100),
      condition: item.weather?.[0]?.main || "Clouds",
    });
  });

  const rainChance = hourly.length > 0 ? hourly[0].precip : 20;

  // Daily Forecast Items (Group OWM 3-hour list by dates)
  const dailyMap: Record<string, any> = {};
  list.forEach((item: any) => {
    const dateObj = new Date(item.dt * 1000);
    const dateStr = dateObj.toDateString();
    if (!dailyMap[dateStr]) {
      dailyMap[dateStr] = {
        temps: [],
        pops: [],
        conditions: [],
        icons: [],
        date: dateObj,
      };
    }
    dailyMap[dateStr].temps.push(item.main?.temp);
    dailyMap[dateStr].pops.push(item.pop || 0);
    dailyMap[dateStr].conditions.push(item.weather?.[0]?.main || "Clouds");
    dailyMap[dateStr].icons.push(item.weather?.[0]?.icon || "03d");
  });

  const dailyForecasts: DailyForecastItem[] = Object.keys(dailyMap)
    .slice(0, 3)
    .map((key) => {
      const g = dailyMap[key];
      const max = Math.round(Math.max(...g.temps));
      const min = Math.round(Math.min(...g.temps));
      const rain = Math.round(Math.max(...g.pops) * 100);
      const cond = g.conditions[0];
      const iconUrl = `https://openweathermap.org/img/wn/${g.icons[0]}@2x.png`;

      return {
        day: g.date.toLocaleDateString("en-US", { weekday: "short" }),
        date: g.date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
        maxTemp: max,
        minTemp: min,
        rainChance: rain,
        condition: cond,
        icon: iconUrl,
      };
    });

  return {
    locationName: weatherData.name || locName,
    region: locRegion,
    country: weatherData.sys?.country || locCountry,
    lat,
    lon,
    temp,
    feelsLike,
    minTemp,
    maxTemp,
    humidity,
    wind: windKph,
    windDir,
    rainChance,
    uvIndex: 5, // Standard UV approximation
    aqiText,
    aqiVal,
    condition,
    icon,
    source: "OpenWeatherMap Live Engine",
    hourly,
    dailyForecasts,
  };
}
