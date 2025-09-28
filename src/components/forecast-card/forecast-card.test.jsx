import React from 'react';
import { render, screen } from '@testing-library/react';

// Mock the CSS import
vi.mock('./forecast-card-style.css', () => ({}));

// Mock utility functions
vi.mock('../utils/getPicture', () => ({
    default: vi.fn()
}));

vi.mock('../utils/getDateTime', () => ({
    getTime: vi.fn()
}));

// Mock image imports
vi.mock('../../icons/temperature.png', () => ({
    default: 'temperature-icon.png'
}));

import ForecastCard from './forecast-card';
import getPicture from '../utils/getPicture';
import { getTime } from '../utils/getDateTime';

describe('ForecastCard Component', () => {
    const mockData = {
        dt: 1640995200, // Unix timestamp
        weather: [
            {
                icon: '01d',
                main: 'Clear'
            }
        ],
        main: {
            temp: 15.5
        }
    };

    beforeEach(() => {
        vi.clearAllMocks();

        // Set up default mock implementations
        getPicture.mockReturnValue('https://openweathermap.org/img/wn/01d@2x.png');
        getTime.mockReturnValue('12:00');
    });

    it('renders forecast card with correct structure', () => {
        const { container } = render(<ForecastCard data={mockData} />);

        const forecastCard = container.querySelector('.forecastCard');
        expect(forecastCard).toBeInTheDocument();
    });

    it('displays time correctly', () => {
        render(<ForecastCard data={mockData} />);

        expect(getTime).toHaveBeenCalledWith(mockData.dt);
        expect(screen.getByText('12:00')).toBeInTheDocument();
    });

    it('renders weather icon with correct src and alt', () => {
        render(<ForecastCard data={mockData} />);

        expect(getPicture).toHaveBeenCalledWith('01d');

        const weatherIcon = screen.getByAltText('icon');
        expect(weatherIcon).toBeInTheDocument();
        expect(weatherIcon).toHaveAttribute('src', 'https://openweathermap.org/img/wn/01d@2x.png');
        expect(weatherIcon).toHaveClass('forecastImage');
    });

    it('displays weather description', () => {
        render(<ForecastCard data={mockData} />);

        expect(screen.getByText('Clear')).toBeInTheDocument();
        const description = screen.getByText('Clear');
        expect(description).toHaveClass('forcastDesc');
    });

    it('renders temperature icon with correct attributes', () => {
        render(<ForecastCard data={mockData} />);

        const tempIcon = screen.getByAltText('temp');
        expect(tempIcon).toBeInTheDocument();
        expect(tempIcon).toHaveAttribute('src', 'temperature-icon.png');
        expect(tempIcon).toHaveClass('tempIcon');
    });

    it('displays temperature rounded to nearest integer with degree symbol', () => {
        render(<ForecastCard data={mockData} />);

        // Should round 15.5 to 16
        expect(screen.getByText(/16°C/)).toBeInTheDocument();
    });

    it('handles decimal temperatures correctly', () => {
        const dataWithDecimal = {
            ...mockData,
            main: { temp: 23.7 }
        };

        render(<ForecastCard data={dataWithDecimal} />);

        // Should round 23.7 to 24
        expect(screen.getByText(/24°C/)).toBeInTheDocument();
    });

    it('handles negative temperatures correctly', () => {
        const dataWithNegativeTemp = {
            ...mockData,
            main: { temp: -5.3 }
        };

        render(<ForecastCard data={dataWithNegativeTemp} />);

        // Should round -5.3 to -5
        expect(screen.getByText(/-5°C/)).toBeInTheDocument();
    });

    it('applies correct CSS classes to elements', () => {
        const { container } = render(<ForecastCard data={mockData} />);

        expect(container.querySelector('.forecastCard')).toBeInTheDocument();
        expect(container.querySelector('.time')).toBeInTheDocument();
        expect(container.querySelector('.smallIcon')).toBeInTheDocument();
        expect(container.querySelector('.forcastDesc')).toBeInTheDocument();
        expect(container.querySelector('.temp')).toBeInTheDocument();
        expect(container.querySelector('.forecastImage')).toBeInTheDocument();
        expect(container.querySelector('.tempIcon')).toBeInTheDocument();
    });

    it('handles different weather conditions', () => {
        const rainyData = {
            ...mockData,
            weather: [
                {
                    icon: '10d',
                    main: 'Rain'
                }
            ]
        };

        getPicture.mockReturnValue('https://openweathermap.org/img/wn/10d@2x.png');

        render(<ForecastCard data={rainyData} />);

        expect(getPicture).toHaveBeenCalledWith('10d');
        expect(screen.getByText('Rain')).toBeInTheDocument();

        const weatherIcon = screen.getByAltText('icon');
        expect(weatherIcon).toHaveAttribute('src', 'https://openweathermap.org/img/wn/10d@2x.png');
    });

    it('handles zero temperature correctly', () => {
        const dataWithZeroTemp = {
            ...mockData,
            main: { temp: 0 }
        };

        render(<ForecastCard data={dataWithZeroTemp} />);

        expect(screen.getByText(/0°C/)).toBeInTheDocument();
    });

    it('calls utility functions with correct parameters', () => {
        render(<ForecastCard data={mockData} />);

        expect(getTime).toHaveBeenCalledTimes(1);
        expect(getTime).toHaveBeenCalledWith(mockData.dt);
        expect(getPicture).toHaveBeenCalledTimes(1);
        expect(getPicture).toHaveBeenCalledWith(mockData.weather[0].icon);
    });
});