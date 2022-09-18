import React from "react";
import "./forecast-card-style.css";
import getPicture from "../utils/getPicture";
import { getDateTime, getTime } from "../utils/getDateTime";
import temperatureIcon from "../../icons/temperature.png";
import pressureIcon from "../../icons/pressure.png";
import humidityIcon from "../../icons/humidity.png";

export default function ForecastCard({ data }) {
    return (
        <div className="forecastCard">
            <div>
                <b> {getDateTime(data.dt)}</b> <br />
                {getTime(data.dt)}
            </div>
            <div className="icon">
                <img
                    className="forecastimage"
                    src={getPicture(data.weather[0].icon)}
                    alt="icon"
                />
                <div className="forcastDesc">{data.weather[0].main}</div>
                <div className="temp">
                    <img
                        className="tempIcon"
                        src={temperatureIcon}
                        alt="temp"
                    />{" "}
                    {data.main.temp}&#176;C
                </div>
                <div className="temp">
                    <img className="tempIcon" src={pressureIcon} alt="temp" />{" "}
                    {data.main.pressure}hPa
                </div>
                <div className="temp">
                    <img className="tempIcon" src={humidityIcon} alt="temp" />{" "}
                    {data.main.humidity}%
                </div>
            </div>
        </div>
    );
}
