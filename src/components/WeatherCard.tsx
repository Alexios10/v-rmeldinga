import {
  Sun,
  Wind,
  Droplets,
  Thermometer,
  Sunrise,
  Sunset,
} from "lucide-react";
import { Card } from "@/components/ui/card";

interface WeatherData {
  location: string;
  temperature: number;
  condition: string;
  humidity: number;
  windSpeed: number;
  feelsLike: number;
  sunrise?: number;
  sunset?: number;
}

interface WeatherCardProps {
  data: WeatherData;
  isLoading: boolean;
}

export const WeatherCard = ({ data, isLoading }: WeatherCardProps) => {
  // Helper to format unix timestamp (seconds) to HH:mm
  const formatTime = (unix: number) => {
    if (!unix) return "-";
    const date = new Date(unix * 1000);
    return date.toLocaleTimeString("nb-NO", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  };
  const getNorwegianCondition = (condition: string) => {
    switch (condition) {
      case "sunny":
        return "Sol";
      case "cloudy":
        return "Overskyet";
      case "rain":
        return "Regn";
      case "partly-cloudy":
        return "Delvis skyet";
      case "snow":
        return "Snø";
      default:
        return condition;
    }
  };

  const getWeatherIcon = (condition: string) => {
    switch (condition) {
      case "sunny":
        return (
          <img
            src="/assets/sun.gif"
            alt="Sunny"
            className="w-16 h-16 text-yellow-300"
          />
        );
      case "cloudy":
        return <img src="/assets/cloudy.gif" alt="" className="w-16 h-16" />;
      case "rain":
        return <img src="/assets/rain.gif" alt="" className="w-16 h-16" />;
      case "partly-cloudy":
        return (
          <img
            src="/assets/partly-cloudy.gif"
            alt="Sunny"
            className="w-16 h-16 text-yellow-300"
          />
        );
      default:
        return <Sun className="w-16 h-16 text-yellow-300" />;
    }
  };

  if (isLoading) {
    return (
      <Card
        className="p-4 bg-black/40 backdrop-blur-md border-white/30 animate-pulse"
        aria-busy="true"
        aria-label="Loading forecast data"
      >
        <div className="space-y-4">
          <div
            className="h-8 bg-white/30 rounded w-3/4"
            aria-hidden="true"
          ></div>
          <div
            className="h-16 bg-white/30 rounded w-1/2"
            aria-hidden="true"
          ></div>
          <div
            className="h-6 bg-white/30 rounded w-full"
            aria-hidden="true"
          ></div>
        </div>
        <span className="sr-only">Laster inn vær informasjon</span>
      </Card>
    );
  }
  return (
    <Card
      className="p-8 bg-black/60 backdrop-blur-md border-white/30 hover:bg-black/70 focus-within:bg-black/70 transition-all duration-300 shadow-xl focus-within:ring-2 focus-within:ring-white/50"
      role="region"
      aria-labelledby="weather-location"
      tabIndex={0}
    >
      <section className="flex flex-col md:flex-row items-center justify-between space-y-6 md:space-y-0">
        {/* Left section */}
        <div className="text-center md:text-left">
          <h2
            id="weather-location"
            className="text-2xl font-bold text-white mb-2 drop-shadow"
          >
            {data.location}
          </h2>
          <div className="flex items-center justify-center md:justify-start space-x-4 mb-4">
            <div aria-label={getNorwegianCondition(data.condition)}>
              {getWeatherIcon(data.condition)}
            </div>
            <span
              aria-label={`Current temperature ${data.temperature} degrees Celsius`}
              className="text-6xl font-light text-white drop-shadow-lg"
            >
              {data.temperature}°
            </span>
          </div>
          <p className="text-xl text-white/90 capitalize drop-shadow">
            {getNorwegianCondition(data.condition.replace("-", " "))}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full md:w-auto mt-5">
            {/* Sunrise */}
            <div
              className="flex items-center space-x-3 rounded-lg p-2 justify-center mr-5 md:mr-0 md:justify-start"
              aria-label="Sunrise"
            >
              <Sunrise className="text-white" />
              <div className="text-white">
                <p className="text-sm opacity-80">Sol opp</p>
                <p className="text-lg font-semibold">
                  {formatTime(data.sunrise ?? 0)}
                </p>
              </div>
            </div>

            {/* Sunset */}
            <div
              className="flex items-center space-x-3 rounded-lg p-2 justify-center mr-5 md:mr-0 md:justify-start"
              aria-label="Sol ned"
            >
              <Sunset className="text-white" />
              <div className="text-white">
                <p className="text-sm opacity-80">Sol ned</p>
                <p className="text-lg font-semibold">
                  {formatTime(data.sunset ?? 0)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full md:w-auto">
          <div
            className="flex items-center space-x-3 bg-black/30 rounded-lg p-4 border border-white/20"
            role="group"
            aria-labelledby="Feels-like-label"
          >
            <Thermometer className="w-6 h-6 text-white" />
            <div className="text-white">
              <p id="feels-like-label" className="text-sm text-white/80">
                Føles som
              </p>
              <p
                className="text-xl font-semibold"
                aria-label={`Feels like ${data.feelsLike} degrees Celsius`}
              >
                {data.feelsLike}°
              </p>
            </div>
          </div>

          <div
            className="flex items-center space-x-3 bg-black/30 rounded-lg p-4 border border-white/20"
            role="group"
            aria-labelledby="Humidity-label"
          >
            <Droplets className="w-6 h-6 text-white" aria-hidden={true} />
            <div className="text-white">
              <p id="humidity-label" className="text-sm text-white/80">
                Fuktighet
              </p>
              <p
                className="text-xl font-semibold"
                aria-label={`Humidity ${data.humidity} percent`}
              >
                {data.humidity}%
              </p>
            </div>
          </div>

          <div
            className="flex items-center space-x-3 bg-black/30 rounded-lg p-4 border border-white/20"
            role="group"
            aria-labelledby="wind-label"
          >
            <Wind className="w-6 h-6 text-white" aria-hidden={true} />
            <div className="text-white">
              <p id="wind-label" className="text-sm text-white/80">
                Vind
              </p>
              <p
                className="text-xl font-semibold"
                aria-label={`Wind speed ${data.windSpeed} meters per hour`}
              >
                {data.windSpeed} m/s
              </p>
            </div>
          </div>
        </div>
      </section>
    </Card>
  );
};
