import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

import { toast } from "react-toastify";

const initialState = {
    cityLatLon: {
        name: "-----"
    },
    data: {
        cod: 0,
        main: {
            temp: "---",
            feels_like: "---",
            humidity: "---",
            temp_max: "---",
            temp_min: "---",
            pressure: "---"
        },
        weather: [
            {
                icon: "01d",
                main: "---"
            }
        ],
        wind: {
            speed: 0,
            deg: 0
        },
        clouds: {
            all: 0
        },
        sys: {
            sunrise: 0,
            sunset: 0
        }
    },
    airPollution: {
        pm10: 0,
        no2: 0,
        o3: 0,
        pm2_5: 0
    },
    forecast: {
        list: []
    }
};

const APIKEY = import.meta.env.VITE_APIKEY;

const errorLoading = () => {
    toast.error(`City can't be found.`, {
        position: "bottom-left",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: false,
        draggable: false,
        progress: undefined,
        toastId: "error",
        theme: "dark"
    });
};

const loaded = () => {
    toast.success(`Data loaded.`, {
        position: "bottom-left",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: false,
        draggable: false,
        progress: undefined,
        toastId: "success",
        theme: "dark"
    });
};

const dataSlice = createSlice({
    name: "data",
    initialState,
    reducers: {
        setData(state, action) {
            state.data = action.payload;
        },
        setLatLon(state, action) {
            state.cityLatLon = action.payload;
        },
        setAirPollution(state, action) {
            state.airPollution = action.payload;
        },
        setForecast(state, action) {
            state.forecast = [...action.payload];
        }
    }
});

export const getAPIData = (cityName) => {
    return async (dispatch) => {
        const latLonURL = `https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${APIKEY}`;

        axios
            .get(latLonURL)
            .then((resp) => {
                if (resp.data.length != 0) {
                    dispatch(setLatLon(resp.data[0]));

                    // Get Weather data
                    const getWeatherURL = `https://api.openweathermap.org/data/2.5/weather?lat=${resp.data[0].lat}&lon=${resp.data[0].lon}&appid=${APIKEY}&units=metric`;
                    axios
                        .get(getWeatherURL)
                        .then((response) => {
                            dispatch(setData(response.data));
                            loaded();
                        })
                        .catch((err) => {
                            errorLoading();
                        });

                    // Get Air Pollution data
                    const getAirQualityURL = `https://api.openweathermap.org/data/2.5/air_pollution?lat=${resp.data[0].lat}&lon=${resp.data[0].lon}&appid=${APIKEY}`;
                    axios
                        .get(getAirQualityURL)
                        .then((response) => {
                            let airdata = response.data.list[0].components;
                            dispatch(setAirPollution(airdata));
                        })
                        .catch((err) => {
                            errorLoading();
                        });

                    // Get forecast for five days
                    const getForecastFive = `https://api.openweathermap.org/data/2.5/forecast?lat=${resp.data[0].lat}&lon=${resp.data[0].lon}&appid=${APIKEY}&units=metric`;
                    axios
                        .get(getForecastFive)
                        .then((response) => {
                            let forecastData = response.data.list;
                            dispatch(setForecast(forecastData));
                        })
                        .catch((err) => {
                            errorLoading();
                        });
                } else {
                    errorLoading();
                }
            })
            .catch((err) => {
                console.log(err);
                errorLoading();
            });
    };
};

// Action creators are generated for each case reducer function
export const { setData, setLatLon, setAirPollution, setForecast } =
    dataSlice.actions;

export default dataSlice.reducer;
