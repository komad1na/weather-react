import React, { useRef } from "react";
import { useSelector } from "react-redux";
import "./forecast-list-style.css";
import ForecastCard from "../forecast-card/forecast-card";
import { getForecastDays } from "../utils/getForecastDays";
import { getDateTime } from "../utils/getDateTime";

export default function ForecastList() {
    const forecastData = useSelector((state) => state.data.forecast);
    const scrollContainerRef = useRef(null);

    const handleWheelScroll = (event) => {
        event.preventDefault();
        const container = scrollContainerRef.current;
        if (container) {
            const scrollAmount = event.deltaY;
            container.scrollLeft += scrollAmount;
        }
    };

    if (!forecastData || !Array.isArray(forecastData) || forecastData.length === 0) {
        return null;
    }

    const forecastDays = getForecastDays(forecastData);
    const validDays = forecastDays.filter(day => Array.isArray(day) && day.length >= 3);

    return (
        <div className="daily-forecast-container">
            {validDays.map((dayData, dayIndex) => (
                <div className="daily-forecast-day" key={dayIndex}>
                    <div className="daily-forecast-date">
                        {getDateTime(dayData[0].dt)}
                    </div>
                    <div className="daily-forecast-hours-container">
                        <div className="daily-forecast-hours-scroll">
                            {dayData.map((item, cardIndex) => (
                                <div className="daily-forecast-hour-card" key={`${dayIndex}-${cardIndex}`}>
                                    <ForecastCard data={item} />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
