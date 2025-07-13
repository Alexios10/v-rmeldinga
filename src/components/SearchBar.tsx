import { useState } from "react";
import { Search, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface SearchBarProps {
  onSearch: (location: string) => void;
  isLoading: boolean;
  apiKey: string;
}

export const SearchBar = ({ onSearch, isLoading, apiKey }: SearchBarProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Fetch city suggestions from OpenWeatherMap Geocoding API
  const fetchSuggestions = async (query: string) => {
    if (!query.trim()) {
      setSuggestions([]);
      return;
    }
    try {
      const url = `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(
        query
      )}&limit=5&appid=${apiKey}`;
      const res = await fetch(url);
      if (!res.ok) return;
      const data = await res.json();
      const filtered = data.filter((item: any) =>
        item.name.toLowerCase().startsWith(query.trim().toLowerCase())
      );
      setSuggestions(filtered);
    } catch {
      setSuggestions([]);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    setShowSuggestions(true);
    fetchSuggestions(value);
  };

  const handleSuggestionClick = (suggestion: any) => {
    const name =
      suggestion.name + (suggestion.country ? ", " + suggestion.country : "");
    setSearchTerm(name);
    setShowSuggestions(false);
    onSearch(name);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowSuggestions(false);
    if (searchTerm.trim()) {
      onSearch(searchTerm.trim());
    }
  };

  const handleClear = () => {
    setSearchTerm("");
    setSuggestions([]);
    setShowSuggestions(false);
  };

  return (
    <Card className="p-6 bg-black/40 backdrop-blur-md border-white/30 shadow-lg relative z-10">
      <form
        onSubmit={handleSubmit}
        className="flex space-x-4 relative"
        role="search"
        aria-label="Søk etter sted"
      >
        <div className="flex-1 relative">
          <label htmlFor="weather-search" className="sr-only">
            Søk etter bynavn
          </label>
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5"
            aria-hidden="true"
          />
          {searchTerm && (
            <button
              onClick={handleClear}
              className="absolute right-2 top-2 rounded-lg w-4 text-gray-500"
              aria-label="Tøm søkefeltet"
              type="button"
            >
              X
            </button>
          )}

          <Input
            id="weather-search"
            type="text"
            placeholder="Skriv inn bynavn (f.eks. London, Tokyo, Paris)"
            value={searchTerm}
            onChange={handleInputChange}
            className="pl-10 bg-white/60 border-white/50 text-gray-800 placeholder-gray-600 focus:bg-white/80  transition-colors"
            disabled={isLoading}
            autoComplete="off"
            aria-autocomplete="list"
            aria-controls="search-suggestion-list"
            aria-expanded={showSuggestions && suggestions.length > 0}
            aria-describedby="search-instructions"
            onFocus={() => searchTerm && setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 100)}
          />
          <div id="search-instructions" className="sr-only">
            Skriv inn et bynavn og velg fra forslagene, eller trykk enter for å
            søke.
          </div>
          {showSuggestions && suggestions.length > 0 && (
            <ul
              id="search-suggestion-list"
              role="listbox"
              className="absolute left-0 right-0 mt-2 bg-white/90 border border-white/50 rounded shadow-lg z-50 max-h-56 overflow-auto"
            >
              {suggestions.map((s, idx) => (
                <li
                  key={s.lat + s.lon + s.name + idx}
                  className="px-4 py-2 cursor-pointer hover:bg-blue-100 text-gray-800"
                  onMouseDown={() => handleSuggestionClick(s)}
                  role="option"
                  aria-selected={false}
                >
                  {s.name}
                  {s.state ? `, ${s.state}` : ""}
                  {s.country ? `, ${s.country}` : ""}
                </li>
              ))}
            </ul>
          )}
        </div>
        <Button
          type="submit"
          disabled={isLoading || !searchTerm.trim()}
          className="bg-white/30 hover:bg-white/40 text-white border-white/30 transition-colors"
          aria-label="Søk etter vær for valgt sted"
        >
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Search className="w-4 h-4" />
          )}
        </Button>
      </form>
    </Card>
  );
};
