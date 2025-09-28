import React from "react";
import "./sun-info-style.css";
import { useSelector } from "react-redux/es/hooks/useSelector";
import sunrise from "../../icons/sunrise.png";
import sunset from "../../icons/sunset.png";
import { getTime } from "../utils/getDateTime";

export default function SunInfo() {
    const suninfo = useSelector((state) => state.data.data.sys);

    if (!suninfo) {
        return null;
    }

    const sunriseTime = getTime(suninfo.sunrise);
    const sunsetTime = getTime(suninfo.sunset);

    // Calculate daylight duration
    const calculateDaylightDuration = (sunrise, sunset) => {
        const sunriseDate = new Date(sunrise * 1000);
        const sunsetDate = new Date(sunset * 1000);
        const duration = sunsetDate - sunriseDate;
        const hours = Math.floor(duration / (1000 * 60 * 60));
        const minutes = Math.floor((duration % (1000 * 60 * 60)) / (1000 * 60));
        return `${hours}h ${minutes}m`;
    };

    const daylightDuration = calculateDaylightDuration(suninfo.sunrise, suninfo.sunset);

    return (
        <div className="sun-info-card">
            {/* Header */}
            <div className="sun-info-header">
                <div className="sun-info-title">Sun Times</div>
            </div>

            {/* Sun times container */}
            <div className="sun-times-container">
                {/* Sunrise panel */}
                <div className="sun-time-panel sunrise-panel">
                    <img className="sun-icon" src={sunrise} alt="Sunrise" />
                    <div className="sun-time-content">
                        <div className="sun-time-label">Sunrise</div>
                        <div className="sun-time-value">{sunriseTime}</div>
                    </div>
                </div>

                {/* Sunset panel */}
                <div className="sun-time-panel sunset-panel">
                    <img className="sun-icon" src={sunset} alt="Sunset" />
                    <div className="sun-time-content">
                        <div className="sun-time-label">Sunset</div>
                        <div className="sun-time-value">{sunsetTime}</div>
                    </div>
                </div>
            </div>

            {/* Daylight duration */}
            <div className="daylight-info">
                <div className="daylight-label">Daylight Duration</div>
                <div className="daylight-duration">{daylightDuration}</div>
            </div>
        </div>
    );
}
