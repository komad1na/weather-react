import "react-toastify/dist/ReactToastify.css";
import "./App.css";
import Footer from "./components/footer/Footer";
import Header from "./components/header/Header.js";
import WeatherCard from "./components/weather-card/weather-card";
import { ToastContainer } from "react-toastify";
import AirPollution from "./components/air-pollution/air-pollution";
import SunInfo from "./components/sun-info/sun-info";

function App() {
    return (
        <div className="App">
            <Header />
            <div className="grid">
                <WeatherCard />
                <AirPollution />
                <SunInfo />
            </div>
            <Footer />
            <ToastContainer
                position="bottom-left"
                autoClose={3000}
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
