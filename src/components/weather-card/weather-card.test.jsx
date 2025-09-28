import React from 'react';
import { render, screen } from '@testing-library/react';

// Mock CSS import
vi.mock('./weather-card-style.css', () => ({}));

// Mock utility functions
vi.mock('../utils/getPicture', () => ({
    default: vi.fn()
}));

vi.mock('../utils/getDirectionOfWind', () => ({
    default: vi.fn()
}));

// Mock useSelector hook
vi.mock('react-redux/es/hooks/useSelector', () => ({
    useSelector: vi.fn()
}));

import WeatherCard from './weather-card';
import { useSelector } from 'react-redux/es/hooks/useSelector';
import getPicture from '../utils/getPicture';
import getDirection from '../utils/getDirectionOfWind';

describe('WeatherCard Component', () => {
    const mockWeatherData = {
        main: {
            temp: 15.7,
            feels_like: 18.2,
            humidity: 65,
            pressure: 1013,
            temp_max: 20.5,
            temp_min: 10.3
        },
        weather: [
            {
                main: 'Clear',
                icon: '01d'
            }
        ],
        wind: {
            speed: 5.5,
            deg: 180
        },
        clouds: {
            all: 20
        }
    };

    const mockCityData = {
        name: 'London'
    };

    beforeEach(() => {
        vi.clearAllMocks();

        // Default mock implementations
        getPicture.mockReturnValue('https://openweathermap.org/img/wn/01d@2x.png');
        getDirection.mockReturnValue('S');
        useSelector.mockImplementation((selector) => {
            const state = {
                data: {
                    data: mockWeatherData,
                    cityLatLon: mockCityData
                }
            };
            return selector(state);
        });
    });

    it('renders weather card with correct structure', () => {
        const { container } = render(<WeatherCard />);

        const weatherCard = container.querySelector('.weather-card');
        expect(weatherCard).toBeInTheDocument();
        expect(weatherCard).toHaveClass('weather-card');
    });

    it('returns null when data is not available', () => {
        useSelector.mockImplementation((selector) => {
            const state = {
                data: {
                    data: null,
                    cityLatLon: mockCityData
                }
            };
            return selector(state);
        });

        const { container } = render(<WeatherCard />);
        expect(container.firstChild).toBeNull();
    });

    it('returns null when cityLatLon is not available', () => {
        useSelector.mockImplementation((selector) => {
            const state = {
                data: {
                    data: mockWeatherData,
                    cityLatLon: null
                }
            };
            return selector(state);
        });

        const { container } = render(<WeatherCard />);
        expect(container.firstChild).toBeNull();
    });

    it('renders city name correctly', () => {
        render(<WeatherCard />);

        expect(screen.getByText('London')).toBeInTheDocument();
    });

    it('renders main temperature rounded correctly', () => {
        render(<WeatherCard />);

        // 15.7 should round to 16
        expect(screen.getByText('16°')).toBeInTheDocument();
    });

    it('renders weather icon with correct src and alt', () => {
        render(<WeatherCard />);

        expect(getPicture).toHaveBeenCalledWith('01d');

        const weatherIcon = screen.getByAltText('Clear');
        expect(weatherIcon).toBeInTheDocument();
        expect(weatherIcon).toHaveAttribute('src', 'https://openweathermap.org/img/wn/01d@2x.png');
        expect(weatherIcon).toHaveClass('weather-icon');
    });

    it('renders weather description correctly', () => {
        render(<WeatherCard />);

        expect(screen.getByText('Clear')).toBeInTheDocument();
    });

    it('renders feels like temperature correctly', () => {
        render(<WeatherCard />);

        // 18.2 should round to 18
        expect(screen.getByText('18')).toBeInTheDocument();
        expect(screen.getByText('°C')).toBeInTheDocument();
    });

    it('renders min/max temperatures correctly', () => {
        render(<WeatherCard />);

        // 10.3 should round to 10, 20.5 should round to 21
        expect(screen.getByText('10° / 21°')).toBeInTheDocument();
    });

    it('renders humidity with percentage', () => {
        render(<WeatherCard />);

        expect(screen.getByText('65')).toBeInTheDocument();
        expect(screen.getAllByText('%')).toHaveLength(2); // Humidity and cloudiness
    });

    it('renders pressure with correct unit', () => {
        render(<WeatherCard />);

        expect(screen.getByText('1013')).toBeInTheDocument();
        expect(screen.getByText('hPa')).toBeInTheDocument();
    });

    it('renders wind information correctly', () => {
        render(<WeatherCard />);

        expect(getDirection).toHaveBeenCalledWith(180);
        expect(screen.getByText('5.5')).toBeInTheDocument();
        expect(screen.getByText('m/s S')).toBeInTheDocument();
    });

    it('renders cloudiness correctly', () => {
        render(<WeatherCard />);

        expect(screen.getByText('20')).toBeInTheDocument();
    });

    it('applies correct CSS classes to all elements', () => {
        const { container } = render(<WeatherCard />);

        expect(container.querySelector('.weather-card')).toBeInTheDocument();
        expect(container.querySelector('.weather-header')).toBeInTheDocument();
        expect(container.querySelector('.city-name')).toBeInTheDocument();
        expect(container.querySelector('.weather-main')).toBeInTheDocument();
        expect(container.querySelector('.weather-icon')).toBeInTheDocument();
        expect(container.querySelector('.temperature-display')).toBeInTheDocument();
        expect(container.querySelector('.main-temperature')).toBeInTheDocument();
        expect(container.querySelector('.weather-description')).toBeInTheDocument();
        expect(container.querySelector('.weather-details')).toBeInTheDocument();
        expect(container.querySelector('.weather-detail-item')).toBeInTheDocument();
    });

    it('renders all detail sections with correct labels', () => {
        render(<WeatherCard />);

        expect(screen.getByText('Feels Like')).toBeInTheDocument();
        expect(screen.getByText('Min/Max')).toBeInTheDocument();
        expect(screen.getByText('Humidity')).toBeInTheDocument();
        expect(screen.getByText('Pressure')).toBeInTheDocument();
        expect(screen.getByText('Wind')).toBeInTheDocument();
        expect(screen.getByText('Cloudiness')).toBeInTheDocument();
    });

    it('applies specific CSS classes to detail items', () => {
        const { container } = render(<WeatherCard />);

        expect(container.querySelector('.temperature-detail')).toBeInTheDocument();
        expect(container.querySelector('.humidity-detail')).toBeInTheDocument();
        expect(container.querySelector('.pressure-detail')).toBeInTheDocument();
        expect(container.querySelector('.wind-detail')).toBeInTheDocument();
    });

    it('handles different weather conditions correctly', () => {
        const rainyData = {
            ...mockWeatherData,
            weather: [
                {
                    main: 'Rain',
                    icon: '10d'
                }
            ]
        };

        useSelector.mockImplementation((selector) => {
            const state = {
                data: {
                    data: rainyData,
                    cityLatLon: mockCityData
                }
            };
            return selector(state);
        });

        getPicture.mockReturnValue('https://openweathermap.org/img/wn/10d@2x.png');

        render(<WeatherCard />);

        expect(getPicture).toHaveBeenCalledWith('10d');
        expect(screen.getByText('Rain')).toBeInTheDocument();

        const weatherIcon = screen.getByAltText('Rain');
        expect(weatherIcon).toHaveAttribute('src', 'https://openweathermap.org/img/wn/10d@2x.png');
    });

    it('handles different wind directions', () => {
        const testCases = [
            { deg: 0, direction: 'N' },
            { deg: 90, direction: 'E' },
            { deg: 270, direction: 'W' },
            { deg: 45, direction: 'NE' }
        ];

        testCases.forEach(({ deg, direction }) => {
            const windData = {
                ...mockWeatherData,
                wind: { ...mockWeatherData.wind, deg }
            };

            useSelector.mockImplementation((selector) => {
                const state = {
                    data: {
                        data: windData,
                        cityLatLon: mockCityData
                    }
                };
                return selector(state);
            });

            getDirection.mockReturnValue(direction);

            const { unmount } = render(<WeatherCard />);

            expect(getDirection).toHaveBeenCalledWith(deg);
            expect(screen.getByText(`m/s ${direction}`)).toBeInTheDocument();

            unmount();
        });
    });

    it('handles negative temperatures correctly', () => {
        const coldData = {
            ...mockWeatherData,
            main: {
                ...mockWeatherData.main,
                temp: -5.7,
                feels_like: -8.2,
                temp_max: -2.1,
                temp_min: -10.8
            }
        };

        useSelector.mockImplementation((selector) => {
            const state = {
                data: {
                    data: coldData,
                    cityLatLon: mockCityData
                }
            };
            return selector(state);
        });

        render(<WeatherCard />);

        expect(screen.getByText('-6°')).toBeInTheDocument(); // -5.7 rounds to -6
        expect(screen.getByText('-8')).toBeInTheDocument(); // -8.2 rounds to -8
        expect(screen.getByText('-11° / -2°')).toBeInTheDocument(); // -10.8 to -11, -2.1 to -2
    });

    it('handles zero values correctly', () => {
        const zeroData = {
            ...mockWeatherData,
            main: {
                ...mockWeatherData.main,
                temp: 0,
                feels_like: 0,
                temp_max: 0,
                temp_min: 0,
                humidity: 0,
                pressure: 0
            },
            wind: {
                speed: 0,
                deg: 0
            },
            clouds: {
                all: 0
            }
        };

        useSelector.mockImplementation((selector) => {
            const state = {
                data: {
                    data: zeroData,
                    cityLatLon: mockCityData
                }
            };
            return selector(state);
        });

        getDirection.mockReturnValue('N');

        render(<WeatherCard />);

        expect(screen.getByText('0°')).toBeInTheDocument();
        expect(screen.getByText('0° / 0°')).toBeInTheDocument();
    });

    it('processes weather data correctly', () => {
        render(<WeatherCard />);

        // Verify that useSelector is called to get both data and cityLatLon
        expect(useSelector).toHaveBeenCalledTimes(2);
    });

    it('calls utility functions with correct parameters', () => {
        render(<WeatherCard />);

        expect(getPicture).toHaveBeenCalledWith('01d');
        expect(getDirection).toHaveBeenCalledWith(180);
    });

    it('rounds temperatures using Math.round correctly', () => {
        // Test various decimal values
        const decimalData = {
            ...mockWeatherData,
            main: {
                ...mockWeatherData.main,
                temp: 15.4, // Should round to 15
                feels_like: 18.6, // Should round to 19
                temp_max: 20.5, // Should round to 21
                temp_min: 10.2 // Should round to 10
            }
        };

        useSelector.mockImplementation((selector) => {
            const state = {
                data: {
                    data: decimalData,
                    cityLatLon: mockCityData
                }
            };
            return selector(state);
        });

        render(<WeatherCard />);

        expect(screen.getByText('15°')).toBeInTheDocument();
        expect(screen.getByText('19')).toBeInTheDocument();
        expect(screen.getByText('10° / 21°')).toBeInTheDocument();
    });
});