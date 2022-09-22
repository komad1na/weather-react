import React from "react";
import Text from "../text/text";
import getDirection from "../utils/getDirectionOfWind";

export default function RightPanel({ data }) {
    return (
        <>
            <Text
                frontText="Temperature:"
                dataText={data.temp}
                unit="&#176;C"
            />
            <Text
                frontText="Feels like:"
                dataText={data.feels}
                unit="&#176;C"
            />
            <Text frontText="Humidity:" dataText={data.humidity} unit="%" />
            <Text frontText="Max daily:" dataText={data.max} unit="&#176;C" />
            <Text frontText="Min daily:" dataText={data.min} unit="&#176;C" />
            <Text frontText="Pressure:" dataText={data.pressure} unit="hPa" />
            <Text frontText="Wind speed:" dataText={data.speed} unit="m/s" />
            <Text
                frontText="Wind direction:"
                dataText={getDirection(data.deg)}
                unit=""
            />
            <Text frontText="Cloudiness:" dataText={data.all} unit="%" />
        </>
    );
}
