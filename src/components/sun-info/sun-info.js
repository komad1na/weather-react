import React from "react";
import "./sun-info-style.css";
import { useSelector } from "react-redux/es/hooks/useSelector";
import sunrise from "../../icons/sunrise.png";
import sunset from "../../icons/sunset.png";
import Text from "../text/text";
import { getTime } from "../utils/getDateTime";

export default function SunInfo() {
    let suninfo = useSelector((state) => state.data.data.sys);

    return (
        <div className="sun-info-card">
            <div className="leftPanel">
                <img className="sunrise" src={sunrise} alt="sunrise img" />
                <Text
                    frontText="Sunrise at "
                    dataText={getTime(suninfo.sunrise)}
                    unit=""
                />
            </div>
            <div className="rightPanel">
                <img className="sunset" src={sunset} alt="sunset img" />
                <Text
                    frontText="Sunset at "
                    dataText={getTime(suninfo.sunset)}
                    unit=""
                />
            </div>
        </div>
    );
}
