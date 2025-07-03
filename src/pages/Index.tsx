import { useState, useEffect } from "react";
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
  });

  const [forecastData, setForecastData] = useState<ForecastData[]>([
    { day: "Today", high: 75, low: 62, condition: "sunny" },
    { day: "Tomorrow", high: 73, low: 59, condition: "cloudy" },
    { day: "Wednesday", high: 68, low: 55, condition: "rain" },
    { day: "Thursday", high: 71, low: 58, condition: "partly-cloudy" },
    { day: "Friday", high: 74, low: 61, condition: "sunny" },
  ]);

  const [isLoading, setIsLoading] = useState(false);

  const API_KEY = import.meta.env.VITE_API_KEY;

  // Function to map OpenWeatherMap conditions to our icons
  const mapWeatherCondition = (
    weatherMain: string,
    weatherDescription: string
  ) => {
    const main = weatherMain.toLowerCase();
    const description = weatherDescription.toLowerCase();

    if (main === "clear") return "sunny";
    if (main === "clouds") {
      return description.includes("few") || description.includes("scattered")
        ? "partly-cloudy"
        : "cloudy";
    }
    if (main === "rain" || main === "drizzle") return "rain";
    if (main === "snow") return "rain"; // Using rain icon for snow as we don't have a snow condition
    return "partly-cloudy";
  };

  // Function to handle location search
  const handleLocationSearch = async (location: string) => {
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
        throw new Error(`Weather HTTP ${weatherResponse.status}: ${errorText}`);
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
      });

      // Process forecast data (group by day and get daily high/low)
      const dailyForecasts: {
        [key: string]: { temps: number[]; condition: string };
      } = {};

      forecastData.list.forEach((item: any) => {
        const date = new Date(item.dt * 1000);
        const dayKey = date.toLocaleDateString("en-US", { weekday: "long" });
        const temp = Math.round(item.main.temp); // Keep in Celsius

        if (!dailyForecasts[dayKey]) {
          dailyForecasts[dayKey] = {
            temps: [],
            condition: mapWeatherCondition(
              item.weather[0].main,
              item.weather[0].description
            ),
          };
        }

        dailyForecasts[dayKey].temps.push(temp);
      });

      const processedForecast = Object.entries(dailyForecasts)
        .slice(0, 5)
        .map(([day, data], index) => ({
          day: index === 0 ? "Today" : day,
          high: Math.max(...data.temps),
          low: Math.min(...data.temps),
          condition: data.condition,
        }));

      setForecastData(processedForecast);

      toast.success(`Weather updated for ${name}, ${country}`);
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
  };

  // Load initial weather data for Oslo
  useEffect(() => {
    handleLocationSearch("Oslo");
  }, []);

  return (
    <div className="min-h-screen relative overflow-hidden">
      <WeatherBackground condition={weatherData.condition} />

      <div className="relative z-10 min-h-screen">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="text-center mb-8">
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 drop-shadow-lg">
                Weather App
              </h1>
              <p className="text-xl text-white/80 drop-shadow">
                Beautiful weather forecasts at your fingertips
              </p>
            </div>

            <SearchBar onSearch={handleLocationSearch} isLoading={isLoading} />

            <WeatherCard data={weatherData} isLoading={isLoading} />

            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-white drop-shadow-lg">
                5-Day Forecast
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                {forecastData.map((forecast, index) => (
                  <ForecastCard
                    key={index}
                    data={forecast}
                    isLoading={isLoading}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
