import { useState, useEffect, useCallback } from "react";
import { WeatherCard } from "@/components/WeatherCard";
import { ForecastCard } from "@/components/ForecastCard";
import { SearchBar } from "@/components/SearchBar";
import { WeatherBackground } from "@/components/WeatherBackground";
import { toast } from "sonner";

interface WeatherData {
  location: string;
  temperature: number;
  condition: string;
  humidity: number;
  windSpeed: number;
  feelsLike: number;
  sunrise: number; // unix timestamp (seconds)
  sunset: number; // unix timestamp (seconds)
}

interface ForecastData {
  day: string;
  high: number;
  low: number;
  condition: string;
}

const Index = () => {
  const [weatherData, setWeatherData] = useState<WeatherData>({
    location: "New York, NY",
    temperature: 72,
    condition: "sunny",
    humidity: 65,
    windSpeed: 8,
    feelsLike: 75,
    sunrise: 0,
    sunset: 0,
  });

  // dummy data for initial render
  const [forecastData, setForecastData] = useState<ForecastData[]>([
    { day: "Idag", high: 75, low: 62, condition: "sunny" },
    { day: "I morgen", high: 73, low: 59, condition: "cloudy" },
    { day: "Onsdag", high: 68, low: 55, condition: "rain" },
    { day: "Torsdag", high: 71, low: 58, condition: "partly-cloudy" },
    { day: "Fredag", high: 74, low: 61, condition: "sunny" },
  ]);

  const [isLoading, setIsLoading] = useState(false);

  const API_KEY = import.meta.env.VITE_API_KEY;

  // Function to map OpenWeatherMap conditions to our icons
  const mapWeatherCondition = useCallback(
    (weatherMain: string, weatherDescription: string) => {
      const main = weatherMain.toLowerCase();
      const description = weatherDescription.toLowerCase();

      if (main === "clear") return "sunny";
      if (main === "cloudy") {
        return description.includes("few") || description.includes("scattered")
          ? "partly-cloudy"
          : "cloudy";
      }
      if (main === "rain" || main === "drizzle") return "rain";
      if (main === "snow") return "snow";
      return "partly-cloudy";
    },
    []
  );

  // Function to handle location search
  const handleLocationSearch = useCallback(
    async (location: string) => {
      setIsLoading(true);

      try {
        // Get coordinates from location name
        const geocodingUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(
          location
        )}&limit=1&appid=${API_KEY}`;

        const geocodingResponse = await fetch(geocodingUrl);

        if (!geocodingResponse.ok) {
          const errorText = await geocodingResponse.text();

          if (geocodingResponse.status === 401) {
            throw new Error(
              "Invalid API key. Please check your OpenWeatherMap API key."
            );
          }
          throw new Error(`HTTP ${geocodingResponse.status}: ${errorText}`);
        }

        const geocodingData = await geocodingResponse.json();

        if (geocodingData.length === 0) {
          throw new Error(
            "Location not found. Please try a different city name."
          );
        }

        const { lat, lon, name, country } = geocodingData[0];

        // Get current weather
        const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;

        const weatherResponse = await fetch(weatherUrl);

        if (!weatherResponse.ok) {
          const errorText = await weatherResponse.text();
          throw new Error(
            `Weather HTTP ${weatherResponse.status}: ${errorText}`
          );
        }

        const weatherData = await weatherResponse.json();

        // Get 5-day forecast
        const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;

        const forecastResponse = await fetch(forecastUrl);

        if (!forecastResponse.ok) {
          const errorText = await forecastResponse.text();

          throw new Error(
            `Forecast HTTP ${forecastResponse.status}: ${errorText}`
          );
        }

        const forecastData = await forecastResponse.json();

        // Process current weather
        const condition = mapWeatherCondition(
          weatherData.weather[0].main,
          weatherData.weather[0].description
        );

        setWeatherData({
          location: `${name}, ${country}`,
          temperature: Math.round(weatherData.main.temp), // Keep in Celsius
          condition: condition,
          humidity: weatherData.main.humidity,
          windSpeed: Math.round(weatherData.wind.speed * 3.6), // Convert m/s to km/h
          feelsLike: Math.round(weatherData.main.feels_like), // Keep in Celsius
          sunrise: weatherData.sys?.sunrise || 0,
          sunset: weatherData.sys?.sunset || 0,
        });

        // Norwegian weekday
        const norwegianDays = [
          "Søndag",
          "Mandag",
          "Tirsdag",
          "Onsdag",
          "Torsdag",
          "Fredag",
          "Lørdag",
        ];

        const dailyForecasts: {
          [key: string]: { temps: number[]; condition: string; date: Date };
        } = {};

        forecastData.list.forEach((item: any) => {
          const date = new Date(item.dt * 1000);
          const dayIndex = date.getDay();
          const dayKey = dayIndex.toString();
          const temp = Math.round(item.main.temp); // Keep in Celsius

          if (!dailyForecasts[dayKey]) {
            dailyForecasts[dayKey] = {
              temps: [],
              condition: mapWeatherCondition(
                item.weather[0].main,
                item.weather[0].description
              ),
              date: date,
            };
          }

          dailyForecasts[dayKey].temps.push(temp);
        });

        // Sort by date to ensure correct order
        const sortedForecasts = Object.values(dailyForecasts).sort(
          (a, b) => a.date.getTime() - b.date.getTime()
        );

        const processedForecast = sortedForecasts
          .slice(0, 5)
          .map((data, index) => {
            const dayIndex = data.date.getDay();
            return {
              day: index === 0 ? "I dag" : norwegianDays[dayIndex],
              high: Math.max(...data.temps),
              low: Math.min(...data.temps),
              condition: data.condition,
            };
          });

        setForecastData(processedForecast);

        // toast.success(`Weather updated for ${name}, ${country}`);
      } catch (error) {
        console.error("Error fetching weather data:", error);
        toast.error(
          error instanceof Error
            ? error.message
            : "Failed to fetch weather data. Please try again."
        );
      } finally {
        setIsLoading(false);
      }
    },
    [API_KEY, mapWeatherCondition]
  );

  // Load initial weather data based on user's geolocation
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          try {
            // Reverse geocode to get city name
            const reverseGeocodeUrl = `https://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=1&appid=${API_KEY}`;
            const response = await fetch(reverseGeocodeUrl);
            if (response.ok) {
              const data = await response.json();
              if (data.length > 0 && data[0].name) {
                handleLocationSearch(data[0].name);
                return;
              }
            }
            // If reverse geocoding fails, fallback to New York
            handleLocationSearch("New York");
          } catch {
            handleLocationSearch("New York");
          }
        },
        (error) => {
          // If user denies or error, fallback to New York
          handleLocationSearch("New York");
        }
      );
    } else {
      // Geolocation not supported, fallback to New York
      handleLocationSearch("New York");
    }
  }, [API_KEY, handleLocationSearch]);

  return (
    <div className="min-h-screen relative overflow-hidden">
      <WeatherBackground condition={weatherData.condition} />

      <main className="relative z-10 min-h-screen" id="main-content">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto space-y-8">
            <header className="text-center mb-8" role="banner">
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 drop-shadow-lg">
                Værmeldingen
              </h1>
              <p className="text-xl text-white/80 drop-shadow">
                Værmeldingen lett tilgjengelig
              </p>
            </header>

            <nav
              aria-label="Søk etter sted"
              className="mb-6 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
            >
              <SearchBar
                onSearch={handleLocationSearch}
                isLoading={isLoading}
                apiKey={API_KEY}
              />
            </nav>

            <section aria-label="Nåværende vær" className="mb-8">
              <WeatherCard data={weatherData} isLoading={isLoading} />
              {/* ARIA live region for screen reader announcements */}
              <div
                aria-live="polite"
                aria-atomic="true"
                className="sr-only"
                id="weather-announcement"
              >
                {isLoading
                  ? "Laster værdata..."
                  : `Været for ${weatherData.location}: ${weatherData.temperature} grader, ${weatherData.condition}.`}
              </div>
            </section>

            <section aria-label="5-dagers værmelding" className="space-y-4">
              <h2 className="text-2xl font-bold text-white drop-shadow-lg">
                5-dagers værmelding
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                {forecastData.map((forecast, index) => (
                  <div
                    className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-lg"
                    tabIndex={0}
                    key={index}
                  >
                    <ForecastCard data={forecast} isLoading={isLoading} />
                  </div>
                ))}
              </div>
              {/* ARIA live region for forecast updates */}
              <div
                aria-live="polite"
                aria-atomic="true"
                className="sr-only"
                id="forecast-announcement"
              >
                {isLoading
                  ? "Laster værmelding..."
                  : `5-dagers værmelding oppdatert for ${weatherData.location}.`}
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
