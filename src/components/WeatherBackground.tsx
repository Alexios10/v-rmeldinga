
import { useEffect, useState } from "react";

interface WeatherBackgroundProps {
  condition: string;
}

export const WeatherBackground = ({ condition }: WeatherBackgroundProps) => {
  const [backgroundClass, setBackgroundClass] = useState("");

  useEffect(() => {
    switch (condition) {
      case "sunny":
        setBackgroundClass("bg-gradient-to-br from-yellow-400 via-orange-500 to-red-500");
        break;
      case "cloudy":
        setBackgroundClass("bg-gradient-to-br from-gray-400 via-gray-500 to-gray-600");
        break;
      case "rain":
        setBackgroundClass("bg-gradient-to-br from-blue-800 via-blue-900 to-gray-900");
        break;
      case "partly-cloudy":
        setBackgroundClass("bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600");
        break;
      default:
        setBackgroundClass("bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600");
    }
  }, [condition]);

  return (
    <div 
      className={`absolute inset-0 transition-all duration-1000 ease-in-out ${backgroundClass}`}
    >
      <div className="absolute inset-0 bg-black/10"></div>
    </div>
  );
};
