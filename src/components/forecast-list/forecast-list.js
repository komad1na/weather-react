import React from "react";
import { useSelector } from "react-redux";
import "./forecast-list-style.css";
import ForecastCard from "../forecast-card/forecast-card";
import { getForecastDays } from "../utils/getForecastDays";
import { getDateTime } from "../utils/getDateTime";

export default function ForecastList() {
    let forecastData = useSelector((state) => state.data.forecast);

    if (forecastData.length > 0) {
        var eachDay = getForecastDays(forecastData);

        return (
            <>
                <div className="container">
                    {eachDay.map((x, index) => {
                        return (
                            <div>
                                <div className="date">
                                    {getDateTime(x[0].dt)}
                                </div>
                                <div className="flexForecast" key={index}>
                                    {x.map((item, index) => {
                                        return (
                                            <ForecastCard
                                                key={index}
                                                data={item}
                                            />
                                        );
                                    })}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </>
        );
    }
}
