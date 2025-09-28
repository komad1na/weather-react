import React from "react";
import "./air-pollution-style.css";
import { useSelector } from "react-redux/es/hooks/useSelector";
import { no2, pm10, o3, pm25 } from "../utils/getColor";

export default function AirPollution() {
    const airData = useSelector((state) => state.data.airPollution);

    const pollutants = [
        { name: "NO2", value: airData.no2, colorFn: no2 },
        { name: "PM10", value: airData.pm10, colorFn: pm10 },
        { name: "O3", value: airData.o3, colorFn: o3 },
        { name: "PM2.5", value: airData.pm2_5, colorFn: pm25 }
    ];


    return (
        <div className="air-card">
            <div className="title">Air Pollution</div>
            <div className="pollutants-grid">
                {pollutants.map(pollutant => {
                    const colorData = pollutant.colorFn(pollutant.value);
                    return (
                        <div key={pollutant.name} className="pollutant-item">
                            <div className="pollutant-header">
                                <span className="pollutant-name">{pollutant.name}</span>
                                <span className="pollutant-unit">μg/m3</span>
                            </div>
                            <div className="pollutant-value" style={{ backgroundColor: colorData.color }}>
                                {pollutant.value < 0 ? "N/A" : pollutant.value}
                            </div>
                            <div className="pollutant-quality" style={{ color: colorData.color }}>
                                {colorData.text}
                            </div>
                        </div>
                    );
                })}
            </div>
            <div className="air-info-link">
                <a
                    className="link"
                    href="https://en.wikipedia.org/wiki/Air_quality_index#CAQI"
                >
                    Read more about Air quality index
                </a>
            </div>
        </div>
    );
}
