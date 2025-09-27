import React from "react";
import "./forecast-card-style.css";
import getPicture from "../utils/getPicture";
import { getTime } from "../utils/getDateTime";
import temperatureIcon from "../../icons/temperature.png";

export default function ForecastCard({ data }) {
    return (
        <div className="forecastCard">
            <div className="time">
                <b> {getTime(data.dt)}</b>
            </div>
            <div className="smallIcon">
                <img
                    className="forecastImage"
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
                    {Math.round(data.main.temp)}&#176;C
                </div>
            </div>
        </div>
    );
}
