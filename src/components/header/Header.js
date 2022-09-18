import React from "react";
import CityInput from "../city-input/city-input";
import "./header-style.css";

export default function Header() {
    return (
        <div className="header">
            <CityInput />
        </div>
    );
}
