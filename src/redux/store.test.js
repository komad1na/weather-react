import { configureStore } from '@reduxjs/toolkit';
import { store } from './store';
import dataSliceReducer, {
    setData,
    setLatLon,
    setAirPollution,
    setForecast,
    getAPIData
} from './dataSlice/dataSlice';

// Mock axios for API tests
vi.mock('axios', () => ({
    default: {
        get: vi.fn(() => Promise.resolve({ data: [] }))
    }
}));

// Mock react-toastify
vi.mock('react-toastify', () => ({
    toast: {
        error: vi.fn(),
        success: vi.fn()
    }
}));

// Mock environment variable
vi.mock('import.meta', () => ({
    env: {
        VITE_APIKEY: 'test-api-key'
    }
}));

describe('Redux Store Configuration', () => {
    it('should create store with correct initial state', () => {
        const state = store.getState();

        expect(state).toHaveProperty('data');
        expect(state.data).toHaveProperty('cityLatLon');
        expect(state.data).toHaveProperty('data');
        expect(state.data).toHaveProperty('airPollution');
        expect(state.data).toHaveProperty('forecast');
    });

    it('should have data reducer configured', () => {
        const state = store.getState();

        expect(state.data.cityLatLon.name).toBe('-----');
        expect(state.data.data.cod).toBe(0);
        expect(state.data.data.main.temp).toBe('---');
        expect(state.data.airPollution.pm10).toBe(0);
        expect(state.data.forecast.list).toEqual([]);
    });

    it('should be a valid Redux store instance', () => {
        expect(store).toHaveProperty('dispatch');
        expect(store).toHaveProperty('getState');
        expect(store).toHaveProperty('subscribe');
        expect(typeof store.dispatch).toBe('function');
        expect(typeof store.getState).toBe('function');
        expect(typeof store.subscribe).toBe('function');
    });

    it('should use configureStore from Redux Toolkit', () => {
        // Test that store was created with configureStore (has RTK features)
        expect(store).toHaveProperty('dispatch');

        // RTK stores have enhanced dispatch that can handle thunks
        const state = store.getState();
        expect(state).toBeDefined();
    });
});

describe('Store Reducer Integration', () => {
    it('should handle setData action', () => {
        const mockWeatherData = {
            cod: 200,
            main: {
                temp: 25.5,
                feels_like: 26.1,
                humidity: 65,
                temp_max: 27,
                temp_min: 23,
                pressure: 1013
            },
            weather: [{
                icon: '02d',
                main: 'Clouds'
            }],
            wind: {
                speed: 3.5,
                deg: 180
            },
            clouds: {
                all: 25
            },
            sys: {
                sunrise: 1234567890,
                sunset: 1234567890
            }
        };

        store.dispatch(setData(mockWeatherData));
        const state = store.getState();

        expect(state.data.data).toEqual(mockWeatherData);
        expect(state.data.data.main.temp).toBe(25.5);
        expect(state.data.data.weather[0].main).toBe('Clouds');
    });

    it('should handle setLatLon action', () => {
        const mockLatLon = {
            name: 'London',
            lat: 51.5074,
            lon: -0.1278,
            country: 'GB'
        };

        store.dispatch(setLatLon(mockLatLon));
        const state = store.getState();

        expect(state.data.cityLatLon).toEqual(mockLatLon);
        expect(state.data.cityLatLon.name).toBe('London');
        expect(state.data.cityLatLon.lat).toBe(51.5074);
    });

    it('should handle setAirPollution action', () => {
        const mockAirPollution = {
            pm10: 15.5,
            no2: 25.3,
            o3: 45.8,
            pm2_5: 12.1
        };

        store.dispatch(setAirPollution(mockAirPollution));
        const state = store.getState();

        expect(state.data.airPollution).toEqual(mockAirPollution);
        expect(state.data.airPollution.pm10).toBe(15.5);
        expect(state.data.airPollution.no2).toBe(25.3);
    });

    it('should handle setForecast action', () => {
        const mockForecast = [
            { dt: 1234567890, main: { temp: 20 }, weather: [{ main: 'Clear' }] },
            { dt: 1234567891, main: { temp: 22 }, weather: [{ main: 'Clouds' }] }
        ];

        store.dispatch(setForecast(mockForecast));
        const state = store.getState();

        expect(state.data.forecast).toEqual(mockForecast);
        expect(state.data.forecast).toHaveLength(2);
        expect(state.data.forecast[0].main.temp).toBe(20);
    });
});

describe('Store State Management', () => {
    beforeEach(() => {
        // Reset store to initial state before each test
        // Since we can't easily reset the store, we'll dispatch actions to reset state
        store.dispatch(setData({
            cod: 0,
            main: {
                temp: "---",
                feels_like: "---",
                humidity: "---",
                temp_max: "---",
                temp_min: "---",
                pressure: "---"
            },
            weather: [{
                icon: "01d",
                main: "---"
            }],
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
        }));

        store.dispatch(setLatLon({ name: "-----" }));
        store.dispatch(setAirPollution({ pm10: 0, no2: 0, o3: 0, pm2_5: 0 }));
        store.dispatch(setForecast([]));
    });

    it('should maintain state immutability', () => {
        const initialState = store.getState();
        const mockData = { cod: 200, main: { temp: 25 } };

        store.dispatch(setData(mockData));
        const newState = store.getState();

        // States should be different objects (immutable)
        expect(newState).not.toBe(initialState);
        expect(newState.data.data).not.toBe(initialState.data.data);
    });

    it('should handle multiple sequential actions', () => {
        const cityData = { name: 'Paris', lat: 48.8566, lon: 2.3522 };
        const weatherData = { cod: 200, main: { temp: 18.5 } };
        const airData = { pm10: 20, no2: 15, o3: 35, pm2_5: 18 };

        store.dispatch(setLatLon(cityData));
        store.dispatch(setData(weatherData));
        store.dispatch(setAirPollution(airData));

        const state = store.getState();

        expect(state.data.cityLatLon.name).toBe('Paris');
        expect(state.data.data.main.temp).toBe(18.5);
        expect(state.data.airPollution.pm10).toBe(20);
    });

    it('should handle partial updates correctly', () => {
        // Set initial data
        const initialWeatherData = {
            cod: 200,
            main: { temp: 20, humidity: 60 },
            weather: [{ icon: '01d', main: 'Clear' }]
        };

        store.dispatch(setData(initialWeatherData));

        // Update with new data
        const updatedWeatherData = {
            cod: 200,
            main: { temp: 25, humidity: 70 },
            weather: [{ icon: '02d', main: 'Clouds' }]
        };

        store.dispatch(setData(updatedWeatherData));
        const state = store.getState();

        expect(state.data.data).toEqual(updatedWeatherData);
        expect(state.data.data.main.temp).toBe(25);
        expect(state.data.data.weather[0].main).toBe('Clouds');
    });
});

describe('Store Subscription and Listeners', () => {
    it('should notify subscribers when state changes', () => {
        const listener = vi.fn();
        const unsubscribe = store.subscribe(listener);

        expect(listener).not.toHaveBeenCalled();

        store.dispatch(setData({ cod: 200, main: { temp: 30 } }));

        expect(listener).toHaveBeenCalledTimes(1);

        store.dispatch(setLatLon({ name: 'Berlin' }));

        expect(listener).toHaveBeenCalledTimes(2);

        unsubscribe();
    });

    it('should stop notifying after unsubscribe', () => {
        const listener = vi.fn();
        const unsubscribe = store.subscribe(listener);

        store.dispatch(setData({ cod: 200 }));
        expect(listener).toHaveBeenCalledTimes(1);

        unsubscribe();

        store.dispatch(setData({ cod: 201 }));
        expect(listener).toHaveBeenCalledTimes(1); // Should not increase
    });
});

describe('Store Integration with DataSlice', () => {
    it('should export correct action creators', () => {
        expect(typeof setData).toBe('function');
        expect(typeof setLatLon).toBe('function');
        expect(typeof setAirPollution).toBe('function');
        expect(typeof setForecast).toBe('function');
        expect(typeof getAPIData).toBe('function');
    });

    it('should create actions with correct type and payload structure', () => {
        const testData = { test: 'data' };

        const dataAction = setData(testData);
        expect(dataAction.type).toBe('data/setData');
        expect(dataAction.payload).toEqual(testData);

        const latLonAction = setLatLon(testData);
        expect(latLonAction.type).toBe('data/setLatLon');
        expect(latLonAction.payload).toEqual(testData);

        const airAction = setAirPollution(testData);
        expect(airAction.type).toBe('data/setAirPollution');
        expect(airAction.payload).toEqual(testData);

        const forecastAction = setForecast(testData);
        expect(forecastAction.type).toBe('data/setForecast');
        expect(forecastAction.payload).toEqual(testData);
    });

    it('should handle thunk actions (getAPIData)', () => {
        // Test that the store can handle thunk actions
        const thunk = getAPIData('London');

        expect(typeof thunk).toBe('function');

        // Test that dispatch can handle the thunk
        // Note: This will trigger API calls, but we've mocked axios
        expect(() => {
            const result = store.dispatch(thunk);
            // The thunk should return a promise-like object
            expect(result).toBeDefined();
        }).not.toThrow();
    });
});

describe('Store Error Handling', () => {
    it('should handle invalid actions gracefully', () => {
        const initialState = store.getState();

        // Try to dispatch an action that doesn't exist
        expect(() => {
            store.dispatch({ type: 'INVALID_ACTION', payload: {} });
        }).not.toThrow();

        // State should remain unchanged
        const stateAfter = store.getState();
        expect(stateAfter).toEqual(initialState);
    });

    it('should handle undefined payloads', () => {
        expect(() => {
            store.dispatch(setData(undefined));
        }).not.toThrow();

        const state = store.getState();
        expect(state.data.data).toBeUndefined();
    });

    it('should handle null payloads', () => {
        expect(() => {
            store.dispatch(setLatLon(null));
        }).not.toThrow();

        const state = store.getState();
        expect(state.data.cityLatLon).toBeNull();
    });
});

describe('Store Performance and Memory', () => {
    it('should handle large forecast arrays efficiently', () => {
        const largeForecast = Array.from({ length: 1000 }, (_, i) => ({
            dt: 1234567890 + i,
            main: { temp: 20 + (i % 10) },
            weather: [{ main: `Weather${i}` }]
        }));

        const startTime = performance.now();
        store.dispatch(setForecast(largeForecast));
        const endTime = performance.now();

        expect(endTime - startTime).toBeLessThan(100); // Should be fast

        const state = store.getState();
        expect(state.data.forecast).toHaveLength(1000);
        expect(state.data.forecast[999].main.temp).toBe(29);
    });

    it('should handle rapid successive dispatches', () => {
        const updates = 100;

        // Test that multiple rapid dispatches work without errors
        for (let i = 0; i < updates; i++) {
            store.dispatch(setData({ cod: 200 + i, main: { temp: i } }));
        }

        const state = store.getState();
        expect(state.data.data.cod).toBe(299); // Last update
        expect(state.data.data.main.temp).toBe(99);
    });
});

describe('Store Real-world Usage Patterns', () => {
    it('should simulate typical weather app workflow', () => {
        // 1. User searches for a city
        const cityData = {
            name: 'New York',
            lat: 40.7128,
            lon: -74.0060,
            country: 'US'
        };
        store.dispatch(setLatLon(cityData));

        // 2. Weather data loads
        const weatherData = {
            cod: 200,
            main: { temp: 22, humidity: 55, pressure: 1015 },
            weather: [{ icon: '03d', main: 'Clouds' }],
            wind: { speed: 4.1, deg: 230 },
            sys: { sunrise: 1234567890, sunset: 1234567920 }
        };
        store.dispatch(setData(weatherData));

        // 3. Air pollution data loads
        const airData = { pm10: 18, no2: 22, o3: 65, pm2_5: 14 };
        store.dispatch(setAirPollution(airData));

        // 4. Forecast data loads
        const forecastData = Array.from({ length: 5 }, (_, i) => ({
            dt: 1234567890 + (i * 86400), // 5 days
            main: { temp: 20 + i * 2 },
            weather: [{ main: 'Clear' }]
        }));
        store.dispatch(setForecast(forecastData));

        // Verify complete state
        const finalState = store.getState();

        expect(finalState.data.cityLatLon.name).toBe('New York');
        expect(finalState.data.data.main.temp).toBe(22);
        expect(finalState.data.airPollution.pm10).toBe(18);
        expect(finalState.data.forecast).toHaveLength(5);
        expect(finalState.data.forecast[4].main.temp).toBe(28);
    });

    it('should handle city change workflow', () => {
        // Initial city
        store.dispatch(setLatLon({ name: 'London', lat: 51.5074, lon: -0.1278 }));
        store.dispatch(setData({ cod: 200, main: { temp: 15 } }));

        let state = store.getState();
        expect(state.data.cityLatLon.name).toBe('London');
        expect(state.data.data.main.temp).toBe(15);

        // Change to new city
        store.dispatch(setLatLon({ name: 'Tokyo', lat: 35.6762, lon: 139.6503 }));
        store.dispatch(setData({ cod: 200, main: { temp: 28 } }));

        state = store.getState();
        expect(state.data.cityLatLon.name).toBe('Tokyo');
        expect(state.data.data.main.temp).toBe(28);
    });
});