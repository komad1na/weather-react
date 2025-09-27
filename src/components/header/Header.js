import React from "react";
const CityInput = require("../city-input/CityInput").default;
import "./header-style.css";

export default function Header() {
    return (
        <div className="header">
            <CityInput />
        </div>
    );
}
