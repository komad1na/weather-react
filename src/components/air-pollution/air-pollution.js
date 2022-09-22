import React from "react";
import "./air-pollution-style.css";
import { useSelector } from "react-redux/es/hooks/useSelector";
import { no2, pm10, o3, pm25 } from "../utils/getColor";
import TableData from "../utils/tableData";

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
                            <TableData
                                color={no2(airData.no2).color}
                                text={airData.no2}
                            />
                            <TableData
                                color={pm10(airData.pm10).color}
                                text={airData.pm10}
                            />
                            <TableData
                                color={o3(airData.o3).color}
                                text={airData.o3}
                            />
                            <TableData
                                color={pm25(airData.pm2_5).color}
                                text={airData.pm2_5}
                            />
                        </tr>
                        <tr>
                            <TableData
                                color={no2(airData.no2).color}
                                text={no2(airData.no2).text}
                            />
                            <TableData
                                color={pm10(airData.pm10).color}
                                text={pm10(airData.pm10).text}
                            />
                            <TableData
                                color={o3(airData.o3).color}
                                text={o3(airData.o3).text}
                            />
                            <TableData
                                color={pm25(airData.pm2_5).color}
                                text={pm25(airData.pm2_5).text}
                            />
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
