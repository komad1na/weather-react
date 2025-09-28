import React from "react";
import { useSelector } from "react-redux/es/hooks/useSelector";
import getPicture from "../utils/getPicture";
import getDirection from "../utils/getDirectionOfWind";
import "./weather-card-style.css";

export default function WeatherCard() {
    const data = useSelector((state) => state.data.data);
    const latlon = useSelector((state) => state.data.cityLatLon);

    if (!data || !latlon) {
        return null;
    }

    const weatherData = {
        cityName: latlon.name,
        temperature: Math.round(data.main.temp),
        feelsLike: Math.round(data.main.feels_like),
        description: data.weather[0].main,
        icon: data.weather[0].icon,
        humidity: data.main.humidity,
        pressure: data.main.pressure,
        windSpeed: data.wind.speed,
        windDirection: getDirection(data.wind.deg),
        cloudiness: data.clouds.all,
        maxTemp: Math.round(data.main.temp_max),
        minTemp: Math.round(data.main.temp_min)
    };

    return (
        <div className="weather-card">
            {/* Header with city and main weather info */}
            <div className="weather-header">
                <div className="city-name">{weatherData.cityName}</div>

                <div className="weather-main">
                    <img
                        className="weather-icon"
                        src={getPicture(weatherData.icon)}
                        alt={weatherData.description}
                    />
                    <div className="temperature-display">
                        <div className="main-temperature">
                            {weatherData.temperature}°
                        </div>
                    </div>
                </div>

                <div className="weather-description">
                    {weatherData.description}
                </div>
            </div>

            {/* Weather details grid */}
            <div className="weather-details">
                <div className="weather-detail-item temperature-detail">
                    <div className="detail-label">Feels Like</div>
                    <div className="detail-value">
                        {weatherData.feelsLike}
                        <span className="detail-unit">°C</span>
                    </div>
                </div>

                <div className="weather-detail-item">
                    <div className="detail-label">Min/Max</div>
                    <div className="detail-value">
                        {weatherData.minTemp}° / {weatherData.maxTemp}°
                    </div>
                </div>

                <div className="weather-detail-item humidity-detail">
                    <div className="detail-label">Humidity</div>
                    <div className="detail-value">
                        {weatherData.humidity}
                        <span className="detail-unit">%</span>
                    </div>
                </div>

                <div className="weather-detail-item pressure-detail">
                    <div className="detail-label">Pressure</div>
                    <div className="detail-value">
                        {weatherData.pressure}
                        <span className="detail-unit">hPa</span>
                    </div>
                </div>

                <div className="weather-detail-item wind-detail">
                    <div className="detail-label">Wind</div>
                    <div className="detail-value">
                        {weatherData.windSpeed}
                        <span className="detail-unit">m/s {weatherData.windDirection}</span>
                    </div>
                </div>

                <div className="weather-detail-item">
                    <div className="detail-label">Cloudiness</div>
                    <div className="detail-value">
                        {weatherData.cloudiness}
                        <span className="detail-unit">%</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
