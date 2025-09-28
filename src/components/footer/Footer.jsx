import React from "react";
import "./footer-style.css";

export default function Footer() {
    return (
        <footer className="footer">
            <a className="footer-link" href="https://github.com/komad1na">
                Nemanja Komadina
            </a>
            &nbsp;&nbsp;&nbsp;
            <a className="footer-link" href="https://openweathermap.org/api">
                OpenWeather API
            </a>
        </footer>
    );
}
