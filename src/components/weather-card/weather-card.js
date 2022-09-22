import React from "react";
import { useSelector } from "react-redux/es/hooks/useSelector";
import LeftPanel from "./left-panel";
import RightPanel from "./right-panel";
import "./weather-card-style.css";

export default function WeatherCard() {
    var data = useSelector((state) => state.data.data);
    var latlon = useSelector((state) => state.data.cityLatLon);
    var rightPanelData = {
        temp: data.main.temp,
        feels: data.main.feels_like,
        humidity: data.main.humidity,
        max: data.main.temp_max,
        min: data.main.temp_min,
        pressure: data.main.pressure,
        speed: data.wind.speed,
        deg: data.wind.deg,
        all: data.clouds.all
    };

    return (
        <div className="weather-card">
            <div className="firstPanel">
                <LeftPanel
                    city={latlon.name}
                    icon={data.weather[0].icon}
                    desc={data.weather[0].main}
                />
            </div>
            <div className="secondPanel">
                <RightPanel data={rightPanelData} />
            </div>
        </div>
    );
}
