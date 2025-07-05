import { Cloud, Sun, CloudRain, CloudSnow } from "lucide-react";
import { Card } from "@/components/ui/card";

interface ForecastData {
  day: string;
  high: number;
  low: number;
  condition: string;
}

interface ForecastCardProps {
  data: ForecastData;
  isLoading: boolean;
}

export const ForecastCard = ({ data, isLoading }: ForecastCardProps) => {
  const getWeatherIcon = (condition: string) => {
    switch (condition) {
      case "sunny":
        return (
          <img
            src="/public/assets/sun.gif"
            alt="Sunny"
            className="w-16 h-16 text-yellow-300"
          />
        );
      case "cloudy":
        return (
          <img src="/public/assets/cloudy.gif" alt="" className="w-16 h-16" />
        );
      case "rain":
        return (
          <img src="/public/assets/rain.gif" alt="" className="w-16 h-16" />
        );
      case "partly-cloudy":
        return (
          <img
            src="/public/assets/partly-cloudy.gif"
            alt="Sunny"
            className="w-16 h-16 text-yellow-300"
          />
        );
      default:
        return <Sun className="w-8 h-8 text-yellow-300" />;
    }
  };

  if (isLoading) {
    return (
      <Card className="p-4 bg-white/20 backdrop-blur-md border-white/30 animate-pulse">
        <div className="space-y-3 text-center">
          <div className="h-4 bg-white/30 rounded w-full"></div>
          <div className="h-8 bg-white/30 rounded-full w-8 mx-auto"></div>
          <div className="h-6 bg-white/30 rounded w-full"></div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-4 bg-white/20 backdrop-blur-md border-white/30 hover:bg-white/25 transition-all duration-300 hover:scale-105 shadow-lg">
      <div className="text-center space-y-3">
        <h3 className="font-semibold text-white drop-shadow">{data.day}</h3>

        <div className="flex justify-center">
          {getWeatherIcon(data.condition)}
        </div>

        <div className="space-y-1">
          <p className="text-xl font-bold text-white drop-shadow">
            {data.high}°
          </p>
          <p className="text-sm text-white/70 drop-shadow">{data.low}°</p>
        </div>
      </div>
    </Card>
  );
};
