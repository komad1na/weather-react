import React from "react";
import { useSelector } from "react-redux";
import "./forecast-list-style.css";
import ForecastCard from "../forecast-card/forecast-card";

export default function ForecastList() {
    let forecastData = useSelector((state) => state.data.forecast);
    console.log(forecastData);

    if (forecastData.length > 0) {
        return (
            <>
                <div className="flexForecast">
                    {forecastData.map((x, index) => {
                        return <ForecastCard key={index} data={x} />;
                    })}
                </div>
            </>
        );
    }
}
