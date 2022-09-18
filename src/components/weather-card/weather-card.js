import React from "react";
import { useSelector } from "react-redux/es/hooks/useSelector";
import Text from "../text/text";
import getDirection from "../utils/getDirectionOfWind";
import getPicture from "../utils/getPicture";
import "./weather-card-style.css";

export default function WeatherCard() {
    let data = useSelector((state) => state.data.data);
    let latlon = useSelector((state) => state.data.cityLatLon);
    return (
        <div className="weather-card">
            <div className="firstPanel">
                <div className="city-name">{latlon.name}</div>
                <div className="icon">
                    <img
                        className="image"
                        src={getPicture(data.weather[0].icon)}
                        alt="icon"
                    />
                    <div className="descriptionIcon">
                        {data.weather[0].main}
                    </div>
                </div>
            </div>
            <div className="secondPanel">
                <Text
                    frontText="Temperature:"
                    dataText={data.main.temp}
                    unit="&#176;C"
                />

                <Text
                    frontText="Feels like:"
                    dataText={data.main.feels_like}
                    unit="&#176;C"
                />

                <Text
                    frontText="Humidity:"
                    dataText={data.main.humidity}
                    unit="%"
                />
                <Text
                    frontText="Max daily:"
                    dataText={data.main.temp_max}
                    unit="&#176;C"
                />
                <Text
                    frontText="Min daily:"
                    dataText={data.main.temp_min}
                    unit="&#176;C"
                />
                <Text
                    frontText="Pressure:"
                    dataText={data.main.pressure}
                    unit="hPa"
                />
                <Text
                    frontText="Wind speed:"
                    dataText={data.wind.speed}
                    unit="m/s"
                />

                <Text
                    frontText="Wind direction:"
                    dataText={getDirection(data.wind.deg)}
                    unit=""
                />
                <Text
                    frontText="Cloudiness:"
                    dataText={data.clouds.all}
                    unit="%"
                />

                <br />
            </div>
        </div>
    );
}
