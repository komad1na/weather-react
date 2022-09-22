import React from "react";
import getPicture from "../utils/getPicture";

export default function LeftPanel({ data }) {
    return (
        <>
            <div className="city-name">{data.name}</div>
            <div className="icon">
                <img className="image" src={getPicture(data.icon)} alt="icon" />
                <div className="descriptionIcon">{data.desc}</div>
            </div>
        </>
    );
}
