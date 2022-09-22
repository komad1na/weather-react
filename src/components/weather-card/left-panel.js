import React from "react";
import getPicture from "../utils/getPicture";

export default function LeftPanel({ city, icon, desc }) {
    return (
        <>
            <div className="city-name">{city}</div>
            <div className="icon">
                <img className="image" src={getPicture(icon)} alt="icon" />
                <div className="descriptionIcon">{desc}</div>
            </div>
        </>
    );
}
