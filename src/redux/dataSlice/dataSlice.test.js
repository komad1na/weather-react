import { configureStore } from '@reduxjs/toolkit';
import axios from 'axios';

// Mock dependencies
vi.mock('axios');
vi.mock('react-toastify', () => ({
    toast: {
        error: vi.fn(),
        success: vi.fn()
    }
}));

import dataReducer, {
    setData,
    setLatLon,
    setAirPollution,
    setForecast,
    getAPIData
} from './dataSlice';
import { toast } from 'react-toastify';

const mockedAxios = vi.mocked(axios);

describe('dataSlice', () => {
    let store;

    beforeEach(() => {
        vi.clearAllMocks();
        store = configureStore({
            reducer: {
                data: dataReducer
            }
        });
    });

    describe('Initial State', () => {
        it('should have correct initial state', () => {
            const state = store.getState().data;

            expect(state.cityLatLon).toEqual({
                name: "-----"
            });

            expect(state.data).toEqual({
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
            });

            expect(state.airPollution).toEqual({
                pm10: 0,
                no2: 0,
                o3: 0,
                pm2_5: 0
            });

            expect(state.forecast).toEqual({
                list: []
            });
        });
    });

    describe('Reducers', () => {
        describe('setData', () => {
            it('should update data state', () => {
                const weatherData = {
                    cod: 200,
                    main: {
                        temp: 25,
                        feels_like: 28
                    }
                };

                store.dispatch(setData(weatherData));
                const state = store.getState().data;

                expect(state.data).toEqual(weatherData);
            });
        });

        describe('setLatLon', () => {
            it('should update cityLatLon state', () => {
                const cityData = {
                    name: 'London',
                    lat: 51.5074,
                    lon: -0.1278
                };

                store.dispatch(setLatLon(cityData));
                const state = store.getState().data;

                expect(state.cityLatLon).toEqual(cityData);
            });
        });

        describe('setAirPollution', () => {
            it('should update airPollution state', () => {
                const airData = {
                    pm10: 25,
                    no2: 30,
                    o3: 100,
                    pm2_5: 15
                };

                store.dispatch(setAirPollution(airData));
                const state = store.getState().data;

                expect(state.airPollution).toEqual(airData);
            });
        });

        describe('setForecast', () => {
            it('should update forecast state as array', () => {
                const forecastData = [
                    { dt: 1641038400, temp: 20 },
                    { dt: 1641049200, temp: 22 },
                    { dt: 1641060000, temp: 18 }
                ];

                store.dispatch(setForecast(forecastData));
                const state = store.getState().data;

                expect(state.forecast).toEqual(forecastData);
                expect(Array.isArray(state.forecast)).toBe(true);
            });

            it('should spread array payload correctly', () => {
                const forecastData = [
                    { dt: 1641038400, temp: 20 }
                ];

                store.dispatch(setForecast(forecastData));
                const state = store.getState().data;

                // Should be a new array, not reference to original
                expect(state.forecast).not.toBe(forecastData);
                expect(state.forecast).toEqual(forecastData);
            });
        });
    });

    describe('getAPIData Thunk', () => {
        let mockGeocodeResponse, mockWeatherResponse, mockAirQualityResponse, mockForecastResponse;

        beforeEach(() => {
            // Reset all data for each test
            mockGeocodeResponse = {
                data: [{
                    name: 'London',
                    lat: 51.5074,
                    lon: -0.1278
                }]
            };

            mockWeatherResponse = {
                data: {
                    cod: 200,
                    main: { temp: 25, feels_like: 28 },
                    weather: [{ main: 'Clear', icon: '01d' }]
                }
            };

            mockAirQualityResponse = {
                data: {
                    list: [{
                        components: {
                            pm10: 25,
                            no2: 30,
                            o3: 100,
                            pm2_5: 15
                        }
                    }]
                }
            };

            mockForecastResponse = {
                data: {
                    list: [
                        { dt: 1641038400, main: { temp: 20 } },
                        { dt: 1641049200, main: { temp: 22 } }
                    ]
                }
            };
        });

        it('should handle successful API calls', async () => {
            // Mock successful axios calls
            mockedAxios.get
                .mockResolvedValueOnce(mockGeocodeResponse) // Geocoding
                .mockResolvedValueOnce(mockWeatherResponse) // Weather
                .mockResolvedValueOnce(mockAirQualityResponse) // Air quality
                .mockResolvedValueOnce(mockForecastResponse); // Forecast

            const dispatch = vi.fn();
            const getState = vi.fn();

            // Call the thunk
            getAPIData('London')(dispatch, getState);

            // Wait for all axios calls to complete
            await vi.waitFor(() => {
                expect(dispatch).toHaveBeenCalledWith(setLatLon(mockGeocodeResponse.data[0]));
            }, { timeout: 1000 });

            // Wait for all other async operations
            await vi.waitFor(() => {
                expect(dispatch).toHaveBeenCalledWith(setData(mockWeatherResponse.data));
            }, { timeout: 1000 });

            await vi.waitFor(() => {
                expect(dispatch).toHaveBeenCalledWith(setAirPollution(mockAirQualityResponse.data.list[0].components));
            }, { timeout: 1000 });

            await vi.waitFor(() => {
                expect(dispatch).toHaveBeenCalledWith(setForecast(mockForecastResponse.data.list));
            }, { timeout: 1000 });

            // Verify dispatch calls
            expect(dispatch).toHaveBeenCalledWith(setLatLon(mockGeocodeResponse.data[0]));
            expect(dispatch).toHaveBeenCalledWith(setData(mockWeatherResponse.data));
            expect(dispatch).toHaveBeenCalledWith(setAirPollution(mockAirQualityResponse.data.list[0].components));
            expect(dispatch).toHaveBeenCalledWith(setForecast(mockForecastResponse.data.list));

            // Wait for success toast
            await vi.waitFor(() => {
                expect(toast.success).toHaveBeenCalledWith('Data loaded.', {
                    position: "top-right",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: false,
                    pauseOnHover: false,
                    draggable: false,
                    progress: undefined,
                    toastId: "success",
                    theme: "dark"
                });
            }, { timeout: 1000 });
        });

        it('should make correct API calls with proper URLs', async () => {
            mockedAxios.get
                .mockResolvedValueOnce(mockGeocodeResponse)
                .mockResolvedValueOnce(mockWeatherResponse)
                .mockResolvedValueOnce(mockAirQualityResponse)
                .mockResolvedValueOnce(mockForecastResponse);

            const dispatch = vi.fn();
            const getState = vi.fn();

            getAPIData('London')(dispatch, getState);

            // Wait for all API calls to complete
            await vi.waitFor(() => {
                expect(mockedAxios.get).toHaveBeenCalledTimes(4);
            }, { timeout: 1000 });

            // Check geocoding call
            expect(mockedAxios.get.mock.calls[0][0]).toContain('api.openweathermap.org/geo/1.0/direct');
            expect(mockedAxios.get.mock.calls[0][0]).toContain('q=London');

            // Check weather call
            expect(mockedAxios.get.mock.calls[1][0]).toContain('api.openweathermap.org/data/2.5/weather');
            expect(mockedAxios.get.mock.calls[1][0]).toContain('lat=51.5074');

            // Check air pollution call
            expect(mockedAxios.get.mock.calls[2][0]).toContain('api.openweathermap.org/data/2.5/air_pollution');

            // Check forecast call
            expect(mockedAxios.get.mock.calls[3][0]).toContain('api.openweathermap.org/data/2.5/forecast');
        });

        it('should handle city not found error', async () => {
            // Mock empty geocoding response
            mockedAxios.get.mockResolvedValueOnce({ data: [] });

            const dispatch = vi.fn();
            const getState = vi.fn();

            getAPIData('NonExistentCity')(dispatch, getState);

            // Wait for error toast
            await vi.waitFor(() => {
                expect(toast.error).toHaveBeenCalled();
            }, { timeout: 1000 });

            expect(toast.error).toHaveBeenCalledWith("City can't be found.", {
                position: "top-right",
                autoClose: 4000,
                hideProgressBar: false,
                closeOnClick: false,
                pauseOnHover: false,
                draggable: false,
                progress: undefined,
                toastId: "error",
                theme: "dark"
            });

            // Should not call other APIs
            expect(mockedAxios.get).toHaveBeenCalledTimes(1);
        });

        it('should handle geocoding API error', async () => {
            mockedAxios.get.mockRejectedValueOnce(new Error('Network error'));

            const dispatch = vi.fn();
            const getState = vi.fn();

            getAPIData('London')(dispatch, getState);

            // Wait for error toast
            await vi.waitFor(() => {
                expect(toast.error).toHaveBeenCalled();
            }, { timeout: 1000 });

            expect(toast.error).toHaveBeenCalledWith("City can't be found.", expect.any(Object));
        });

        it('should handle weather API error', async () => {
            mockedAxios.get
                .mockResolvedValueOnce(mockGeocodeResponse) // Geocoding success
                .mockRejectedValueOnce(new Error('Weather API error')); // Weather API error

            const dispatch = vi.fn();
            const getState = vi.fn();

            getAPIData('London')(dispatch, getState);

            // Wait for error toast
            await vi.waitFor(() => {
                expect(toast.error).toHaveBeenCalled();
            }, { timeout: 1000 });

            expect(dispatch).toHaveBeenCalledWith(setLatLon(mockGeocodeResponse.data[0]));
            expect(toast.error).toHaveBeenCalledWith("City can't be found.", expect.any(Object));
        });

        it('should handle air quality API error gracefully', async () => {
            mockedAxios.get
                .mockResolvedValueOnce(mockGeocodeResponse) // Geocoding success
                .mockResolvedValueOnce(mockWeatherResponse) // Weather success
                .mockRejectedValueOnce(new Error('Air quality API error')) // Air quality error
                .mockResolvedValueOnce(mockForecastResponse); // Forecast success

            const dispatch = vi.fn();
            const getState = vi.fn();

            getAPIData('London')(dispatch, getState);

            // Wait for error toast
            await vi.waitFor(() => {
                expect(toast.error).toHaveBeenCalled();
            }, { timeout: 1000 });

            // Should still succeed with weather and forecast data
            expect(dispatch).toHaveBeenCalledWith(setLatLon(mockGeocodeResponse.data[0]));
            expect(dispatch).toHaveBeenCalledWith(setData(mockWeatherResponse.data));
            expect(dispatch).toHaveBeenCalledWith(setForecast(mockForecastResponse.data.list));
            expect(toast.success).toHaveBeenCalled();
            expect(toast.error).toHaveBeenCalled();
        });

        it('should handle forecast API error gracefully', async () => {
            mockedAxios.get
                .mockResolvedValueOnce(mockGeocodeResponse) // Geocoding success
                .mockResolvedValueOnce(mockWeatherResponse) // Weather success
                .mockResolvedValueOnce(mockAirQualityResponse) // Air quality success
                .mockRejectedValueOnce(new Error('Forecast API error')); // Forecast error

            const dispatch = vi.fn();
            const getState = vi.fn();

            getAPIData('London')(dispatch, getState);

            // Wait for error toast
            await vi.waitFor(() => {
                expect(toast.error).toHaveBeenCalled();
            }, { timeout: 1000 });

            // Should still succeed with weather and air quality data
            expect(dispatch).toHaveBeenCalledWith(setLatLon(mockGeocodeResponse.data[0]));
            expect(dispatch).toHaveBeenCalledWith(setData(mockWeatherResponse.data));
            expect(dispatch).toHaveBeenCalledWith(setAirPollution(mockAirQualityResponse.data.list[0].components));
            expect(toast.success).toHaveBeenCalled();
            expect(toast.error).toHaveBeenCalled();
        });

        it('should handle special characters in city names', async () => {
            mockedAxios.get.mockResolvedValueOnce(mockGeocodeResponse);

            const dispatch = vi.fn();
            const getState = vi.fn();

            getAPIData('São Paulo')(dispatch, getState);

            // Wait for API call
            await vi.waitFor(() => {
                expect(mockedAxios.get).toHaveBeenCalled();
            }, { timeout: 1000 });

            expect(mockedAxios.get.mock.calls[0][0]).toContain('q=São Paulo');
        });

        it('should handle city names with spaces', async () => {
            mockedAxios.get.mockResolvedValueOnce(mockGeocodeResponse);

            const dispatch = vi.fn();
            const getState = vi.fn();

            getAPIData('New York')(dispatch, getState);

            // Wait for API call
            await vi.waitFor(() => {
                expect(mockedAxios.get).toHaveBeenCalled();
            }, { timeout: 1000 });

            expect(mockedAxios.get.mock.calls[0][0]).toContain('q=New York');
        });
    });

    describe('Toast Functions', () => {
        let mockGeocodeResponse, mockWeatherResponse, mockAirQualityResponse, mockForecastResponse;

        beforeEach(() => {
            // Reset all data for each test
            mockGeocodeResponse = {
                data: [{
                    name: 'London',
                    lat: 51.5074,
                    lon: -0.1278
                }]
            };

            mockWeatherResponse = {
                data: {
                    cod: 200,
                    main: { temp: 25, feels_like: 28 },
                    weather: [{ main: 'Clear', icon: '01d' }]
                }
            };

            mockAirQualityResponse = {
                data: {
                    list: [{
                        components: {
                            pm10: 25,
                            no2: 30,
                            o3: 100,
                            pm2_5: 15
                        }
                    }]
                }
            };

            mockForecastResponse = {
                data: {
                    list: [
                        { dt: 1641038400, main: { temp: 20 } },
                        { dt: 1641049200, main: { temp: 22 } }
                    ]
                }
            };
        });

        it('should call error toast with correct parameters', async () => {
            mockedAxios.get.mockResolvedValueOnce({ data: [] }); // Empty geocoding response

            const dispatch = vi.fn();
            const getState = vi.fn();

            await getAPIData('InvalidCity')(dispatch, getState);

            expect(toast.error).toHaveBeenCalledWith("City can't be found.", {
                position: "top-right",
                autoClose: 4000,
                hideProgressBar: false,
                closeOnClick: false,
                pauseOnHover: false,
                draggable: false,
                progress: undefined,
                toastId: "error",
                theme: "dark"
            });
        });

        it('should call success toast with correct parameters', async () => {
            mockedAxios.get
                .mockResolvedValueOnce(mockGeocodeResponse)
                .mockResolvedValueOnce(mockWeatherResponse)
                .mockResolvedValueOnce(mockAirQualityResponse)
                .mockResolvedValueOnce(mockForecastResponse);

            const dispatch = vi.fn();
            const getState = vi.fn();

            getAPIData('London')(dispatch, getState);

            // Wait for success toast
            await vi.waitFor(() => {
                expect(toast.success).toHaveBeenCalledWith("Data loaded.", {
                    position: "top-right",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: false,
                    pauseOnHover: false,
                    draggable: false,
                    progress: undefined,
                    toastId: "success",
                    theme: "dark"
                });
            }, { timeout: 1000 });
        });
    });

    describe('Integration Tests', () => {
        let mockGeocodeResponse, mockWeatherResponse, mockAirQualityResponse, mockForecastResponse;

        beforeEach(() => {
            // Reset all data for each test
            mockGeocodeResponse = {
                data: [{
                    name: 'London',
                    lat: 51.5074,
                    lon: -0.1278
                }]
            };

            mockWeatherResponse = {
                data: {
                    cod: 200,
                    main: { temp: 25, feels_like: 28 },
                    weather: [{ main: 'Clear', icon: '01d' }]
                }
            };

            mockAirQualityResponse = {
                data: {
                    list: [{
                        components: {
                            pm10: 25,
                            no2: 30,
                            o3: 100,
                            pm2_5: 15
                        }
                    }]
                }
            };

            mockForecastResponse = {
                data: {
                    list: [
                        { dt: 1641038400, main: { temp: 20 } },
                        { dt: 1641049200, main: { temp: 22 } }
                    ]
                }
            };
        });

        it('should update store state correctly after successful API call', async () => {
            mockedAxios.get
                .mockResolvedValueOnce(mockGeocodeResponse)
                .mockResolvedValueOnce(mockWeatherResponse)
                .mockResolvedValueOnce(mockAirQualityResponse)
                .mockResolvedValueOnce(mockForecastResponse);

            store.dispatch(getAPIData('London'));

            // Wait for all state updates
            await vi.waitFor(() => {
                const state = store.getState().data;
                expect(state.cityLatLon).toEqual(mockGeocodeResponse.data[0]);
                expect(state.data).toEqual(mockWeatherResponse.data);
                expect(state.airPollution).toEqual(mockAirQualityResponse.data.list[0].components);
                expect(state.forecast).toEqual(mockForecastResponse.data.list);
            }, { timeout: 1000 });
        });

        it('should handle partial API failures gracefully', async () => {
            mockedAxios.get
                .mockResolvedValueOnce(mockGeocodeResponse) // Success
                .mockResolvedValueOnce(mockWeatherResponse) // Success
                .mockRejectedValueOnce(new Error('Air quality failed')) // Failure
                .mockRejectedValueOnce(new Error('Forecast failed')); // Failure

            store.dispatch(getAPIData('London'));

            // Wait for successful data to be set
            await vi.waitFor(() => {
                const state = store.getState().data;
                expect(state.cityLatLon).toEqual(mockGeocodeResponse.data[0]);
                expect(state.data).toEqual(mockWeatherResponse.data);
            }, { timeout: 1000 });

            // Check final state - air pollution and forecast should remain at initial state
            const finalState = store.getState().data;
            expect(finalState.airPollution).toEqual({
                pm10: 0,
                no2: 0,
                o3: 0,
                pm2_5: 0
            });
            expect(finalState.forecast).toEqual({
                list: []
            });
        });
    });
});