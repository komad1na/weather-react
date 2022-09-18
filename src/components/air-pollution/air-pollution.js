import React from "react";
import "./air-pollution-style.css";
import { useSelector } from "react-redux/es/hooks/useSelector";
import { no2, pm10, o3, pm25 } from "../utils/getColor";

export default function AirPollution() {
    let airData = useSelector((state) => state.data.airPollution);

    return (
        <>
            <div className="air-card">
                <div className="title"> Air Pollution</div>
                <table>
                    <tbody>
                        <tr>
                            <th>
                                NO2
                                <br /> <small>μg/m3</small>
                            </th>
                            <th>
                                PM10 <br /> <small>μg/m3</small>
                            </th>
                            <th>
                                O3 <br /> <small>μg/m3</small>
                            </th>
                            <th>
                                PM2.5 <br /> <small>μg/m3</small>
                            </th>
                        </tr>
                        <tr>
                            <td
                                style={{
                                    backgroundColor: no2(airData.no2)[0]
                                }}
                            >
                                {airData.no2}
                            </td>
                            <td
                                style={{
                                    backgroundColor: pm10(airData.pm10)[0]
                                }}
                            >
                                {airData.pm10}
                            </td>
                            <td style={{ backgroundColor: o3(airData.o3)[0] }}>
                                {airData.o3}
                            </td>
                            <td
                                style={{
                                    backgroundColor: pm25(airData.pm2_5)[0]
                                }}
                            >
                                {airData.pm2_5}
                            </td>
                        </tr>
                        <tr>
                            <td
                                style={{ backgroundColor: no2(airData.no2)[0] }}
                            >
                                {no2(airData.no2)[1]}
                            </td>
                            <td
                                style={{
                                    backgroundColor: pm10(airData.pm10)[0]
                                }}
                            >
                                {pm10(airData.pm10)[1]}
                            </td>
                            <td style={{ backgroundColor: o3(airData.o3)[0] }}>
                                {o3(airData.o3)[1]}
                            </td>
                            <td
                                style={{
                                    backgroundColor: pm25(airData.pm2_5)[0]
                                }}
                            >
                                {pm25(airData.pm2_5)[1]}
                            </td>
                        </tr>
                        <tr>
                            <td colSpan={4}>
                                <a
                                    className="link"
                                    href="https://en.wikipedia.org/wiki/Air_quality_index#CAQI"
                                >
                                    Read more about Air quality index
                                </a>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </>
    );
}
