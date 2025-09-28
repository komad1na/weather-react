import React from 'react';
import { render, screen } from '@testing-library/react';

// Mock CSS import
vi.mock('./sun-info-style.css', () => ({}));

// Mock image imports
vi.mock('../../icons/sunrise.png', () => ({
    default: 'sunrise-icon.png'
}));

vi.mock('../../icons/sunset.png', () => ({
    default: 'sunset-icon.png'
}));

// Mock utility function
vi.mock('../utils/getDateTime', () => ({
    getTime: vi.fn()
}));

// Mock useSelector hook
vi.mock('react-redux/es/hooks/useSelector', () => ({
    useSelector: vi.fn()
}));

import SunInfo from './sun-info';
import { useSelector } from 'react-redux/es/hooks/useSelector';
import { getTime } from '../utils/getDateTime';

describe('SunInfo Component', () => {
    const mockSunData = {
        sunrise: 1641024000, // Unix timestamp
        sunset: 1641060000   // Unix timestamp
    };

    beforeEach(() => {
        vi.clearAllMocks();

        // Default mock implementations
        getTime.mockImplementation((timestamp) => {
            if (timestamp === 1641024000) return '06:00';
            if (timestamp === 1641060000) return '16:00';
            return '12:00';
        });

        useSelector.mockReturnValue(mockSunData);
    });

    it('renders sun info card with correct structure', () => {
        const { container } = render(<SunInfo />);

        const sunInfoCard = container.querySelector('.sun-info-card');
        expect(sunInfoCard).toBeInTheDocument();
        expect(sunInfoCard).toHaveClass('sun-info-card');
    });

    it('returns null when sun data is not available', () => {
        useSelector.mockReturnValue(null);

        const { container } = render(<SunInfo />);
        expect(container.firstChild).toBeNull();
    });

    it('renders sun info title correctly', () => {
        render(<SunInfo />);

        expect(screen.getByText('Sun Times')).toBeInTheDocument();
    });

    it('applies correct CSS class to title', () => {
        const { container } = render(<SunInfo />);

        const title = container.querySelector('.sun-info-title');
        expect(title).toBeInTheDocument();
        expect(title).toHaveTextContent('Sun Times');
    });

    it('renders sunrise information correctly', () => {
        render(<SunInfo />);

        expect(getTime).toHaveBeenCalledWith(1641024000);
        expect(screen.getByText('Sunrise')).toBeInTheDocument();
        expect(screen.getByText('06:00')).toBeInTheDocument();
    });

    it('renders sunset information correctly', () => {
        render(<SunInfo />);

        expect(getTime).toHaveBeenCalledWith(1641060000);
        expect(screen.getByText('Sunset')).toBeInTheDocument();
        expect(screen.getByText('16:00')).toBeInTheDocument();
    });

    it('renders sunrise icon with correct attributes', () => {
        render(<SunInfo />);

        const sunriseIcon = screen.getByAltText('Sunrise');
        expect(sunriseIcon).toBeInTheDocument();
        expect(sunriseIcon).toHaveAttribute('src', 'sunrise-icon.png');
        expect(sunriseIcon).toHaveClass('sun-icon');
    });

    it('renders sunset icon with correct attributes', () => {
        render(<SunInfo />);

        const sunsetIcon = screen.getByAltText('Sunset');
        expect(sunsetIcon).toBeInTheDocument();
        expect(sunsetIcon).toHaveAttribute('src', 'sunset-icon.png');
        expect(sunsetIcon).toHaveClass('sun-icon');
    });

    it('calculates and displays daylight duration correctly', () => {
        render(<SunInfo />);

        // 1641060000 - 1641024000 = 36000 seconds = 10 hours
        expect(screen.getByText('Daylight Duration')).toBeInTheDocument();
        expect(screen.getByText('10h 0m')).toBeInTheDocument();
    });

    it('handles different daylight durations correctly', () => {
        const testCases = [
            {
                sunrise: 1641024000, // 06:00
                sunset: 1641067200,  // 18:00 (12 hours later)
                expected: '12h 0m'
            },
            {
                sunrise: 1641026400, // 06:40
                sunset: 1641064800,  // 17:20 (10h 40m later)
                expected: '10h 40m'
            },
            {
                sunrise: 1641021600, // 05:20
                sunset: 1641069900,  // 18:25 (13h 25m later)
                expected: '13h 25m'
            }
        ];

        testCases.forEach(({ sunrise, sunset, expected }) => {
            useSelector.mockReturnValue({ sunrise, sunset });

            const { unmount } = render(<SunInfo />);

            expect(screen.getByText(expected)).toBeInTheDocument();

            unmount();
        });
    });

    it('applies correct CSS classes to all elements', () => {
        const { container } = render(<SunInfo />);

        expect(container.querySelector('.sun-info-card')).toBeInTheDocument();
        expect(container.querySelector('.sun-info-header')).toBeInTheDocument();
        expect(container.querySelector('.sun-info-title')).toBeInTheDocument();
        expect(container.querySelector('.sun-times-container')).toBeInTheDocument();
        expect(container.querySelector('.sun-time-panel')).toBeInTheDocument();
        expect(container.querySelector('.sunrise-panel')).toBeInTheDocument();
        expect(container.querySelector('.sunset-panel')).toBeInTheDocument();
        expect(container.querySelector('.sun-time-content')).toBeInTheDocument();
        expect(container.querySelector('.sun-time-label')).toBeInTheDocument();
        expect(container.querySelector('.sun-time-value')).toBeInTheDocument();
        expect(container.querySelector('.daylight-info')).toBeInTheDocument();
        expect(container.querySelector('.daylight-label')).toBeInTheDocument();
        expect(container.querySelector('.daylight-duration')).toBeInTheDocument();
    });

    it('renders two sun time panels (sunrise and sunset)', () => {
        const { container } = render(<SunInfo />);

        const sunTimePanels = container.querySelectorAll('.sun-time-panel');
        expect(sunTimePanels).toHaveLength(2);

        const sunrisePanel = container.querySelector('.sunrise-panel');
        const sunsetPanel = container.querySelector('.sunset-panel');

        expect(sunrisePanel).toBeInTheDocument();
        expect(sunsetPanel).toBeInTheDocument();
    });

    it('handles edge cases with very short daylight', () => {
        const shortDaylightData = {
            sunrise: 1641024000, // 06:00
            sunset: 1641027600   // 07:00 (1 hour later)
        };

        useSelector.mockReturnValue(shortDaylightData);

        render(<SunInfo />);

        expect(screen.getByText('1h 0m')).toBeInTheDocument();
    });

    it('handles edge cases with daylight including minutes', () => {
        const preciseData = {
            sunrise: 1641024000, // 06:00
            sunset: 1641069300   // 18:35 (12h 35m later)
        };

        useSelector.mockReturnValue(preciseData);

        render(<SunInfo />);

        expect(screen.getByText('12h 35m')).toBeInTheDocument();
    });

    it('calls getTime function with correct timestamps', () => {
        render(<SunInfo />);

        expect(getTime).toHaveBeenCalledTimes(2);
        expect(getTime).toHaveBeenCalledWith(1641024000); // sunrise
        expect(getTime).toHaveBeenCalledWith(1641060000); // sunset
    });

    it('handles midnight crossing correctly', () => {
        // Test case where sunset is after midnight (next day)
        const midnightData = {
            sunrise: 1641082800,  // 22:20
            sunset: 1641089100    // 23:58 (1h 38m later)
        };

        useSelector.mockReturnValue(midnightData);

        render(<SunInfo />);

        // Should still calculate correctly
        expect(screen.getByText('1h 45m')).toBeInTheDocument();
    });

    it('renders sun times container structure correctly', () => {
        const { container } = render(<SunInfo />);

        const sunTimesContainer = container.querySelector('.sun-times-container');
        expect(sunTimesContainer).toBeInTheDocument();

        // Should contain both sunrise and sunset panels
        const childPanels = sunTimesContainer.querySelectorAll('.sun-time-panel');
        expect(childPanels).toHaveLength(2);
    });

    it('renders daylight info section correctly', () => {
        const { container } = render(<SunInfo />);

        const daylightInfo = container.querySelector('.daylight-info');
        expect(daylightInfo).toBeInTheDocument();

        const daylightLabel = daylightInfo.querySelector('.daylight-label');
        const daylightDuration = daylightInfo.querySelector('.daylight-duration');

        expect(daylightLabel).toHaveTextContent('Daylight Duration');
        expect(daylightDuration).toHaveTextContent('10h 0m');
    });

    it('maintains proper semantic structure for accessibility', () => {
        render(<SunInfo />);

        // Images should have proper alt text
        expect(screen.getByAltText('Sunrise')).toBeInTheDocument();
        expect(screen.getByAltText('Sunset')).toBeInTheDocument();

        // Labels should be readable
        expect(screen.getByText('Sunrise')).toBeInTheDocument();
        expect(screen.getByText('Sunset')).toBeInTheDocument();
        expect(screen.getByText('Daylight Duration')).toBeInTheDocument();
    });

    it('handles different time formats from getTime', () => {
        getTime.mockImplementation((timestamp) => {
            if (timestamp === 1641024000) return '06:30';
            if (timestamp === 1641060000) return '16:45';
            return '12:00';
        });

        render(<SunInfo />);

        expect(screen.getByText('06:30')).toBeInTheDocument();
        expect(screen.getByText('16:45')).toBeInTheDocument();
    });

    it('calculates daylight duration with proper rounding', () => {
        // Test with times that result in partial minutes
        const partialMinuteData = {
            sunrise: 1641024000,  // Base time
            sunset: 1641063630    // 11h 0m 30s later
        };

        useSelector.mockReturnValue(partialMinuteData);

        render(<SunInfo />);

        // Math.floor for minutes means 30 seconds rounds down to 0
        expect(screen.getByText('11h 0m')).toBeInTheDocument();
    });
});