import { useState, useEffect } from "react";
import moment from "moment";
import PropTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faLocationDot,
  faDroplet,
  faWind,
  faClock,
} from "@fortawesome/free-solid-svg-icons";

const WxCard = ({ data }) => {
  const apiCountryUrl = "https://flagcdn.com/w40/";
  const windSpeed = data.wind.speed;
  const wSTrans = windSpeed.toFixed(1);
  const utcOffset = data.timezone / 3600;
  const [localTime, setLocalTime] = useState(
    moment.utc().utcOffset(utcOffset).format("h:mm A")
  );

  useEffect(() => {
    const intervalId = setInterval(() => {
      setLocalTime(moment.utc().utcOffset(utcOffset).format("h:mm A"));
    }, 1000);

    return () => clearInterval(intervalId);
  }, [utcOffset]);

  const [description, setDescription] = useState("");
  const [iconUrl, setIconUrl] = useState("");

  useEffect(() => {
    setDescription(data.weather[0].description);
    setIconUrl(`http://openweathermap.org/img/wn/${data.weather[0].icon}.png`);
  }, [data]);

  return (
    <div className="border-t-[1px] mt-7 pt-7 text-center">
      <h2 className="flex justify-center items-center mb-[0.6rem]">
        <FontAwesomeIcon icon={faLocationDot} className="text-base" />
        <span className="m-[0.6rem] text-2xl font-bold">
          {data.name}, {data.sys.country}
        </span>
        <img
          src={apiCountryUrl + data.sys.country.toLowerCase() + ".png"}
          alt="Bandeira do país {data.sys.country}"
          className="h-[20px]"
        />
      </h2>
      <p className="text-7xl">{parseInt(data.main.temp)} °C</p>
      <span className="flex justify-center items-center my-[0.6rem] font-bold">
        <p className="capitalize">{description}</p>
        <img src={iconUrl} alt="Ícone do clima" id="weather-icon" />
      </span>
      <span className="flex justify-center items-center">
        <p className="border-r my-[0.6rem] p-[0.6rem]">
          <FontAwesomeIcon icon={faWind} className="mr-[0.5rem]" />
          {wSTrans} km/h
        </p>
        <p className="border-r my-[0.6rem] p-[0.6rem]">
          <FontAwesomeIcon icon={faDroplet} className="mr-[0.5rem]" />{" "}
          {data.main.humidity}%
        </p>
        <p className="my-[0.6rem] p-[0.6rem]">
          <FontAwesomeIcon icon={faClock} className="mr-[0.5rem]" /> {localTime}
        </p>
      </span>
    </div>
  );
};

WxCard.propTypes = {
  city: PropTypes.string.isRequired,
  temperature: PropTypes.number.isRequired,
  humidity: PropTypes.number.isRequired,
  windSpeed: PropTypes.number.isRequired,
  description: PropTypes.string.isRequired,
  timezone: PropTypes.number.isRequired,
  data: PropTypes.object.isRequired,
};

export default WxCard;
