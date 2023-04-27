import { useState } from "react";
import SearchForm from "./components/SearchForm";
import WeatherCard from "./components/WxCard";

const App = () => {
  const [weatherData, setWeatherData] = useState(null);

  return (
    <div className="container p-8 bg-[#9667e0] shadow rounded-2xl">
      <h1 className="text-4xl text-center font-bold">Urania Weather</h1>
      <SearchForm setWeatherData={setWeatherData} />
      {weatherData && <WeatherCard data={weatherData} />}
    </div>
  );
};

export default App;
