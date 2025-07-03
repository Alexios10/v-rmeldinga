import {
  Cloud,
  Sun,
  CloudRain,
  CloudSnow,
  Wind,
  Droplets,
  Thermometer,
} from "lucide-react";
import { Card } from "@/components/ui/card";

interface WeatherData {
  location: string;
  temperature: number;
  condition: string;
  humidity: number;
  windSpeed: number;
  feelsLike: number;
}

interface WeatherCardProps {
  data: WeatherData;
  isLoading: boolean;
}

export const WeatherCard = ({ data, isLoading }: WeatherCardProps) => {
  const getWeatherIcon = (condition: string) => {
    switch (condition) {
      case "sunny":
        return <Sun className="w-16 h-16 text-yellow-300" />;
      case "cloudy":
        return <Cloud className="w-16 h-16 text-gray-300" />;
      case "rain":
        return <CloudRain className="w-16 h-16 text-blue-300" />;
      case "partly-cloudy":
        return <CloudSnow className="w-16 h-16 text-blue-200" />;
      default:
        return <Sun className="w-16 h-16 text-yellow-300" />;
    }
  };

  if (isLoading) {
    return (
      <Card className="p-8 bg-white/20 backdrop-blur-md border-white/30 animate-pulse">
        <div className="space-y-4">
          <div className="h-8 bg-white/30 rounded w-3/4"></div>
          <div className="h-16 bg-white/30 rounded w-1/2"></div>
          <div className="h-6 bg-white/30 rounded w-full"></div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-8 bg-white/20 backdrop-blur-md border-white/30 hover:bg-white/25 transition-all duration-300 shadow-xl">
      <div className="flex flex-col md:flex-row items-center justify-between space-y-6 md:space-y-0">
        <div className="text-center md:text-left">
          <h2 className="text-2xl font-bold text-white mb-2 drop-shadow">
            {data.location}
          </h2>
          <div className="flex items-center justify-center md:justify-start space-x-4 mb-4">
            {getWeatherIcon(data.condition)}
            <span className="text-6xl font-light text-white drop-shadow-lg">
              {data.temperature}°
            </span>
          </div>
          <p className="text-xl text-white/80 capitalize drop-shadow">
            {data.condition.replace("-", " ")}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full md:w-auto">
          <div className="flex items-center space-x-3 bg-white/10 rounded-lg p-4">
            <Thermometer className="w-6 h-6 text-white" />
            <div className="text-white">
              <p className="text-sm opacity-80">Føles som</p>
              <p className="text-xl font-semibold">{data.feelsLike}°</p>
            </div>
          </div>

          <div className="flex items-center space-x-3 bg-white/10 rounded-lg p-4">
            <Droplets className="w-6 h-6 text-white" />
            <div className="text-white">
              <p className="text-sm opacity-80">Fuktighet</p>
              <p className="text-xl font-semibold">{data.humidity}%</p>
            </div>
          </div>

          <div className="flex items-center space-x-3 bg-white/10 rounded-lg p-4">
            <Wind className="w-6 h-6 text-white" />
            <div className="text-white">
              <p className="text-sm opacity-80">vind</p>
              <p className="text-xl font-semibold">{data.windSpeed} mph</p>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};
