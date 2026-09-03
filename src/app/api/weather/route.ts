import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const API_KEY = process.env.OPENWEATHER_API_KEY || process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY;

const OWM_AQI_SCALE: Record<number, string> = {
  1: "Good",
  2: "Fair",
  3: "Moderate",
  4: "Poor",
  5: "Very Poor",
};

interface OwmGeocodeItem {
  name: string;
  state?: string;
  country: string;
  lat: number;
  lon: number;
}

interface OwmForecastItem {
  dt: number;
  main?: { temp?: number };
  pop?: number;
  weather?: Array<{ main?: string; icon?: string }>;
}

interface DailyGroupData {
  temps: number[];
  pops: number[];
  conditions: string[];
  icons: string[];
  date: Date;
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const action = searchParams.get("action");
  const query = searchParams.get("q");

  if (!API_KEY) {
    return NextResponse.json({ error: "Weather API key not configured." }, { status: 500 });
  }

  // 1. Geocoding Autocomplete Search
  if (action === "geocode") {
    if (!query || query.trim().length < 2) {
      return NextResponse.json({ suggestions: [] });
    }

    try {
      let url = `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(
        query.trim()
      )}&limit=5&appid=${API_KEY}`;
      
      let res = await fetch(url);
      let data: OwmGeocodeItem[] = res.ok ? await res.json() : [];

      if ((!Array.isArray(data) || data.length === 0) && !query.includes(",")) {
        url = `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(
          query.trim() + ",IN"
        )}&limit=5&appid=${API_KEY}`;
        res = await fetch(url);
        if (res.ok) {
          data = await res.json();
        }
      }

      if (Array.isArray(data)) {
        const suggestions = data.map((item: OwmGeocodeItem) => ({
          name: item.name,
          region: item.state || item.country,
          country: item.country,
          lat: item.lat,
          lon: item.lon,
        }));
        return NextResponse.json({ suggestions });
      }

      return NextResponse.json({ suggestions: [] });
    } catch (err) {
      console.error("Geocoding API error:", err);
      return NextResponse.json({ suggestions: [] }, { status: 500 });
    }
  }

  // 2. Fetch Live Weather Details
  if (action === "live" || !action) {
    if (!query) {
      return NextResponse.json({ error: "Missing query parameter 'q'." }, { status: 400 });
    }

    let lat = 19.076;
    let lon = 72.8777;
    let locName = "Mumbai";
    let locRegion = "Maharashtra";
    let locCountry = "IN";

    const parts = query.split(",");
    if (parts.length === 2 && !isNaN(parseFloat(parts[0])) && !isNaN(parseFloat(parts[1]))) {
      lat = parseFloat(parts[0]);
      lon = parseFloat(parts[1]);
      locName = `GPS Location`;
      locRegion = `${lat.toFixed(2)}°, ${lon.toFixed(2)}°`;
      locCountry = "IN";
    } else {
      // Resolve geocode first
      try {
        const geoUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(query.trim())}&limit=1&appid=${API_KEY}`;
        const geoRes = await fetch(geoUrl);
        if (geoRes.ok) {
          const geoData: OwmGeocodeItem[] = await geoRes.json();
          if (Array.isArray(geoData) && geoData.length > 0) {
            lat = geoData[0].lat;
            lon = geoData[0].lon;
            locName = geoData[0].name;
            locRegion = geoData[0].state || geoData[0].country;
            locCountry = geoData[0].country;
          } else {
            locName = query.trim();
          }
        }
      } catch {
        locName = query.trim();
      }
    }

    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`;
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`;
    const pollutionUrl = `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${API_KEY}`;

    try {
      const [weatherRes, forecastRes, pollutionRes] = await Promise.all([
        fetch(weatherUrl),
        fetch(forecastUrl),
        fetch(pollutionUrl),
      ]);

      if (!weatherRes.ok) {
        return NextResponse.json({ error: "Failed to fetch live weather data" }, { status: weatherRes.status });
      }

      const weatherData = await weatherRes.json();
      const forecastData = forecastRes.ok ? await forecastRes.json() : {};
      const pollutionData = pollutionRes.ok ? await pollutionRes.json() : {};

      const temp = Math.round(weatherData.main?.temp ?? 27);
      const feelsLike = Math.round(weatherData.main?.feels_like ?? temp);
      const minTemp = Math.round(weatherData.main?.temp_min ?? temp - 3);
      const maxTemp = Math.round(weatherData.main?.temp_max ?? temp + 4);
      const humidity = weatherData.main?.humidity ?? 80;
      const windKph = Math.round((weatherData.wind?.speed || 0) * 3.6);

      const degrees = weatherData.wind?.deg ?? 0;
      const compassDirections = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"];
      const val = Math.floor((degrees / 22.5) + 0.5);
      const windDir = compassDirections[val % 16];

      const condition = weatherData.weather?.[0]?.main || "Clouds";
      const iconCode = weatherData.weather?.[0]?.icon || "03d";
      const icon = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;

      const aqiIndex = pollutionData.list?.[0]?.main?.aqi || 1;
      const aqiText = OWM_AQI_SCALE[aqiIndex] || "Good";
      const aqiVal = Math.round(pollutionData.list?.[0]?.components?.pm2_5 || 15);

      const hourly: Array<{ time: string; temp: number; precip: number; condition: string }> = [];
      const list: OwmForecastItem[] = forecastData.list || [];

      list.slice(0, 8).forEach((item: OwmForecastItem, idx: number) => {
        const dateObj = new Date(item.dt * 1000);
        const timeStr = dateObj.toLocaleTimeString("en-US", {
          hour: "numeric",
          hour12: true,
        });

        hourly.push({
          time: idx === 0 ? "Now" : timeStr,
          temp: Math.round(item.main?.temp ?? temp),
          precip: Math.round((item.pop || 0) * 100),
          condition: item.weather?.[0]?.main || "Clouds",
        });
      });

      const rainChance = hourly.length > 0 ? hourly[0].precip : 20;

      const dailyMap: Record<string, DailyGroupData> = {};
      list.forEach((item: OwmForecastItem) => {
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
        if (item.main?.temp !== undefined) dailyMap[dateStr].temps.push(item.main.temp);
        dailyMap[dateStr].pops.push(item.pop || 0);
        dailyMap[dateStr].conditions.push(item.weather?.[0]?.main || "Clouds");
        dailyMap[dateStr].icons.push(item.weather?.[0]?.icon || "03d");
      });

      const dailyForecasts = Object.keys(dailyMap)
        .slice(0, 3)
        .map((key) => {
          const g = dailyMap[key];
          const max = g.temps.length > 0 ? Math.round(Math.max(...g.temps)) : temp;
          const min = g.temps.length > 0 ? Math.round(Math.min(...g.temps)) : temp;
          const rain = g.pops.length > 0 ? Math.round(Math.max(...g.pops) * 100) : 0;
          const cond = g.conditions[0] || "Clouds";
          const iconUrl = `https://openweathermap.org/img/wn/${g.icons[0] || "03d"}@2x.png`;

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

      return NextResponse.json({
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
        uvIndex: 5,
        aqiText,
        aqiVal,
        condition,
        icon,
        source: "OpenWeatherMap Live Engine",
        hourly,
        dailyForecasts,
      });
    } catch (err) {
      console.error("Error processing live weather request:", err);
      return NextResponse.json({ error: "Failed to fetch weather telemetry" }, { status: 500 });
    }
  }

  return NextResponse.json({ error: "Invalid action" }, { status: 400 });
}
