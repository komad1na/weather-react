import "react-toastify/dist/ReactToastify.css";
import "./App.css";
import Footer from "./components/footer/Footer.jsx";
import Header from "./components/header/Header.jsx";
import WeatherCard from "./components/weather-card/weather-card.jsx";
import { ToastContainer } from "react-toastify";
import AirPollution from "./components/air-pollution/air-pollution.jsx";
import SunInfo from "./components/sun-info/sun-info.jsx";
import ForecastList from "./components/forecast-list/forecast-list.jsx";

function App() {
    return (
        <div className="App">
            <Header />
            <div className="grid">
                <WeatherCard />
                <AirPollution />
                <SunInfo />
                <ForecastList />
            </div>
            <Footer />
            <ToastContainer
                position="top-right"
                autoClose={4000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick={false}
                rtl={false}
                pauseOnFocusLoss
                draggable={false}
                pauseOnHover={false}
            />
        </div>
    );
}

export default App;
