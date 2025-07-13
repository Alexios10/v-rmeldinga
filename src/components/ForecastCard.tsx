import { Sun } from "lucide-react";
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
        return <Sun className="w-8 h-8 text-yellow-300" />;
    }
  };

  if (isLoading) {
    return (
      <Card
        className="p-4 bg-black/40 backdrop-blur-md border-white/30 animate-pulse"
        role="status"
        aria-label="Loading forecast data"
      >
        <div className="space-y-3 text-center">
          <div
            className="h-4 bg-white/30 rounded w-full"
            aria-hidden="true"
          ></div>
          <div
            className="h-8 bg-white/30 rounded-full w-8 mx-auto"
            aria-hidden="true"
          ></div>
          <div
            className="h-6 bg-white/30 rounded w-full"
            aria-hidden="true"
          ></div>
        </div>
        <span className="sr-only">Laster værmelding for {data.day}</span>
      </Card>
    );
  }

  return (
    <Card
      className="p-4 bg-black/60 backdrop-blur-md border-white/30 hover:bg-black/70 focus-within:bg-black/70 transition-all duration-300 hover:scale-105 focus-within:scale-105 shadow-lg focus-within:ring-2 focus-within:ring-white/50"
      role="article"
      aria-labelledby={`forcast-${data.day.toLowerCase()}`}
      tabIndex={0}
    >
      <section className="text-center space-y-3">
        <h3
          id={`forecast-day-${data.day.toLowerCase()}`}
          className="font-semibold text-white drop-shadow"
        >
          {data.day}
        </h3>

        <div className="flex justify-center">
          {getWeatherIcon(data.condition)}
        </div>

        <div className="space-y-1">
          <p className="text-xl font-bold text-white drop-shadow">
            {data.high}°
          </p>
          <p className="text-sm text-white/80 drop-shadow">{data.low}°</p>
        </div>
      </section>
    </Card>
  );
};
