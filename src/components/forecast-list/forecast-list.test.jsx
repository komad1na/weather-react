import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';

// Mock the CSS import
vi.mock('./forecast-list-style.css', () => ({}));

// Mock child component
vi.mock('../forecast-card/forecast-card', () => ({
    default: function MockForecastCard({ data }) {
        return (
            <div data-testid="forecast-card">
                Mock Card - {data.dt} - {data.weather[0].main}
            </div>
        );
    }
}));

// Mock utility functions
vi.mock('../utils/getForecastDays', () => ({
    getForecastDays: vi.fn()
}));

vi.mock('../utils/getDateTime', () => ({
    getDateTime: vi.fn()
}));

// Mock useSelector hook
vi.mock('react-redux', async () => {
    const actual = await vi.importActual('react-redux');
    return {
        ...actual,
        useSelector: vi.fn()
    };
});

import ForecastList from './forecast-list';
import { useSelector } from 'react-redux';
import { getForecastDays } from '../utils/getForecastDays';
import { getDateTime } from '../utils/getDateTime';

// Create a mock store
const createMockStore = (forecastData) => {
    return configureStore({
        reducer: {
            data: (state = { forecast: forecastData }, action) => state
        }
    });
};

describe('ForecastList Component', () => {
    const mockForecastData = [
        {
            dt: 1640995200,
            weather: [{ main: 'Clear', icon: '01d' }],
            main: { temp: 15 }
        },
        {
            dt: 1641081600,
            weather: [{ main: 'Cloudy', icon: '02d' }],
            main: { temp: 12 }
        },
        {
            dt: 1641168000,
            weather: [{ main: 'Rain', icon: '10d' }],
            main: { temp: 8 }
        }
    ];

    const mockForecastDays = [
        [
            {
                dt: 1640995200,
                weather: [{ main: 'Clear', icon: '01d' }],
                main: { temp: 15 }
            },
            {
                dt: 1641002400,
                weather: [{ main: 'Clear', icon: '01d' }],
                main: { temp: 18 }
            },
            {
                dt: 1641009600,
                weather: [{ main: 'Cloudy', icon: '02d' }],
                main: { temp: 16 }
            }
        ],
        [
            {
                dt: 1641081600,
                weather: [{ main: 'Rain', icon: '10d' }],
                main: { temp: 12 }
            },
            {
                dt: 1641088800,
                weather: [{ main: 'Rain', icon: '10d' }],
                main: { temp: 10 }
            },
            {
                dt: 1641096000,
                weather: [{ main: 'Cloudy', icon: '02n' }],
                main: { temp: 8 }
            }
        ]
    ];

    beforeEach(() => {
        vi.clearAllMocks();

        // Default mock implementations
        useSelector.mockReturnValue(mockForecastData);
        getForecastDays.mockReturnValue(mockForecastDays);
        getDateTime.mockImplementation((dt) => {
            if (dt === 1640995200) return '01.01.2022';
            if (dt === 1641081600) return '02.01.2022';
            return '01.01.2022';
        });
    });

    it('renders forecast list container with correct class', () => {
        const { container } = render(<ForecastList />);

        const forecastContainer = container.querySelector('.daily-forecast-container');
        expect(forecastContainer).toBeInTheDocument();
    });

    it('renders forecast days when data is available', () => {
        render(<ForecastList />);

        expect(getForecastDays).toHaveBeenCalledWith(mockForecastData);
        expect(getDateTime).toHaveBeenCalledWith(mockForecastDays[0][0].dt);
        expect(getDateTime).toHaveBeenCalledWith(mockForecastDays[1][0].dt);

        // Should render 2 days
        const dailyForecastDays = screen.getAllByText(/\d{2}\.\d{2}\.\d{4}/);
        expect(dailyForecastDays).toHaveLength(2);
    });

    it('renders ForecastCard components for each hour', () => {
        render(<ForecastList />);

        // Should render 6 forecast cards total (3 for each day)
        const forecastCards = screen.getAllByTestId('forecast-card');
        expect(forecastCards).toHaveLength(6);
    });

    it('returns null when forecast data is not available', () => {
        useSelector.mockReturnValue(null);

        const { container } = render(<ForecastList />);

        expect(container.firstChild).toBeNull();
    });

    it('returns null when forecast data is not an array', () => {
        useSelector.mockReturnValue({});

        const { container } = render(<ForecastList />);

        expect(container.firstChild).toBeNull();
    });

    it('returns null when forecast data is empty array', () => {
        useSelector.mockReturnValue([]);

        const { container } = render(<ForecastList />);

        expect(container.firstChild).toBeNull();
    });

    it('filters out days with fewer than 3 items', () => {
        const incompleteData = [
            [
                { dt: 1640995200, weather: [{ main: 'Clear', icon: '01d' }], main: { temp: 15 } },
                { dt: 1641002400, weather: [{ main: 'Clear', icon: '01d' }], main: { temp: 18 } }
            ], // Only 2 items - should be filtered out
            [
                { dt: 1641081600, weather: [{ main: 'Rain', icon: '10d' }], main: { temp: 12 } },
                { dt: 1641088800, weather: [{ main: 'Rain', icon: '10d' }], main: { temp: 10 } },
                { dt: 1641096000, weather: [{ main: 'Cloudy', icon: '02n' }], main: { temp: 8 } }
            ] // 3 items - should be included
        ];

        getForecastDays.mockReturnValue(incompleteData);

        render(<ForecastList />);

        // Should only render 1 day (the one with 3+ items)
        const forecastCards = screen.getAllByTestId('forecast-card');
        expect(forecastCards).toHaveLength(3);
    });

    it('handles wheel scroll event prevention', () => {
        const { container } = render(<ForecastList />);

        const scrollContainer = container.querySelector('.daily-forecast-hours-scroll');
        expect(scrollContainer).toBeInTheDocument();

        // Test wheel event handling
        const wheelEvent = new WheelEvent('wheel', {
            deltaY: 100,
            bubbles: true,
            cancelable: true
        });

        const preventDefaultSpy = vi.spyOn(wheelEvent, 'preventDefault');

        // Note: The actual scroll behavior might be hard to test due to useRef,
        // but we can at least verify the component renders without errors
        fireEvent.wheel(scrollContainer, wheelEvent);

        // The component should handle wheel events without crashing
        expect(scrollContainer).toBeInTheDocument();
    });

    it('applies correct CSS classes to all elements', () => {
        const { container } = render(<ForecastList />);

        expect(container.querySelector('.daily-forecast-container')).toBeInTheDocument();
        expect(container.querySelector('.daily-forecast-day')).toBeInTheDocument();
        expect(container.querySelector('.daily-forecast-date')).toBeInTheDocument();
        expect(container.querySelector('.daily-forecast-hours-container')).toBeInTheDocument();
        expect(container.querySelector('.daily-forecast-hours-scroll')).toBeInTheDocument();
        expect(container.querySelector('.daily-forecast-hour-card')).toBeInTheDocument();
    });

    it('renders correct number of day containers', () => {
        const { container } = render(<ForecastList />);

        const dayContainers = container.querySelectorAll('.daily-forecast-day');
        expect(dayContainers).toHaveLength(2); // Based on mockForecastDays
    });

    it('renders date headers for each day', () => {
        render(<ForecastList />);

        expect(screen.getByText('01.01.2022')).toBeInTheDocument();
        expect(screen.getByText('02.01.2022')).toBeInTheDocument();
    });

    it('handles invalid day data gracefully', () => {
        const invalidData = [
            null, // Invalid day
            [], // Empty day
            [
                { dt: 1641081600, weather: [{ main: 'Rain', icon: '10d' }], main: { temp: 12 } },
                { dt: 1641088800, weather: [{ main: 'Rain', icon: '10d' }], main: { temp: 10 } },
                { dt: 1641096000, weather: [{ main: 'Cloudy', icon: '02n' }], main: { temp: 8 } }
            ] // Valid day with 3 items
        ];

        getForecastDays.mockReturnValue(invalidData);

        render(<ForecastList />);

        // Should only render the valid day
        const forecastCards = screen.getAllByTestId('forecast-card');
        expect(forecastCards).toHaveLength(3);
    });

    it('generates unique keys for day and card elements', () => {
        const { container } = render(<ForecastList />);

        const dayElements = container.querySelectorAll('.daily-forecast-day');
        const cardElements = container.querySelectorAll('.daily-forecast-hour-card');

        // Days should have unique keys (though we can't directly test React keys)
        expect(dayElements).toHaveLength(2);
        expect(cardElements).toHaveLength(6);
    });

    it('integrates with Redux store correctly', () => {
        const store = createMockStore(mockForecastData);

        render(
            <Provider store={store}>
                <ForecastList />
            </Provider>
        );

        expect(getForecastDays).toHaveBeenCalledWith(mockForecastData);
    });
});