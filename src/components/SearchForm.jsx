import { useState } from "react";
import axios from "axios";
import PropTypes from "prop-types";
import countries from "countries-list";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import Error from "./Error";
import Loader from "./Loader";

const SearchForm = ({ setWeatherData }) => {
  const apiKey = import.meta.env.VITE_WEATHER_API_KEY;
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [error, setError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setWeatherData(false);
      setIsLoading(true);
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}${
          country ? "," + country : ""
        }&appid=${apiKey}&units=metric&lang=pt_br`
      );
      setIsLoading(false);
      if (response.status === 200) {
        setError(false);
        setWeatherData(response.data);
      } else {
        setError(true);
      }
    } catch (error) {
      setError(true);
      setIsLoading(false);
      setWeatherData(false);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <h3 className="mb-4 text-xl text-center">
          Confira o clima de uma cidade:
        </h3>
        <div className="flex">
          <div>
            <input
              type="text"
              id="city"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="Nome da cidade..."
              className="p-[0.8rem] flex-1 rounded text-black"
            />
          </div>
          <div>
            <select
              name="country"
              onChange={(e) => setCountry(e.target.value)}
              className="p-[0.9rem] flex-1 rounded text-black max-w-[125px] ml-2"
              value={country}
            >
              <option value="" className="text-purple-300">
                Países
              </option>
              {Object.keys(countries.countries).map((countryCode) => (
                <option
                  value={countryCode}
                  key={countryCode}
                  className="text-black"
                >
                  {countries.countries[countryCode].name}
                </option>
              ))}
            </select>
          </div>
          <button
            type="submit"
            className="p-[0.8rem] ml-2 bg-[#672dc3] rounded cursor-pointer	min-w-[50px]"
          >
            <FontAwesomeIcon icon={faMagnifyingGlass} />
          </button>
        </div>
      </form>
      <Error message="Ocorreu um erro. Pesquise novamente!" error={error} />
      {isLoading && <Loader />}
    </div>
  );
};

SearchForm.propTypes = {
  setWeatherData: PropTypes.func.isRequired,
};

export default SearchForm;
