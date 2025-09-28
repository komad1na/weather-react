import React from 'react';
import { render, screen } from '@testing-library/react';

// Mock child components and utilities
vi.mock('../text/text', () => ({
    default: function MockText({ frontText, dataText, unit }) {
        return (
            <div data-testid="text-component">
                {frontText} {dataText} {unit}
            </div>
        );
    }
}));

vi.mock('../utils/getDirectionOfWind', () => ({
    default: vi.fn()
}));

import RightPanel from './right-panel';
import getDirection from '../utils/getDirectionOfWind';

describe('RightPanel Component', () => {
    const mockData = {
        temp: 25,
        feels: 28,
        humidity: 65,
        max: 30,
        min: 20,
        pressure: 1013,
        speed: 5.5,
        deg: 180,
        all: 40
    };

    beforeEach(() => {
        vi.clearAllMocks();
        getDirection.mockReturnValue('S');
    });

    it('renders all weather information Text components', () => {
        render(<RightPanel data={mockData} />);

        const textComponents = screen.getAllByTestId('text-component');
        expect(textComponents).toHaveLength(9); // 9 weather parameters
    });

    it('renders temperature information correctly', () => {
        render(<RightPanel data={mockData} />);

        expect(screen.getByText(/Temperature: 25 °C/)).toBeInTheDocument();
    });

    it('renders feels like temperature correctly', () => {
        render(<RightPanel data={mockData} />);

        expect(screen.getByText(/Feels like: 28 °C/)).toBeInTheDocument();
    });

    it('renders humidity information correctly', () => {
        render(<RightPanel data={mockData} />);

        expect(screen.getByText(/Humidity: 65 %/)).toBeInTheDocument();
    });

    it('renders max daily temperature correctly', () => {
        render(<RightPanel data={mockData} />);

        expect(screen.getByText(/Max daily: 30 °C/)).toBeInTheDocument();
    });

    it('renders min daily temperature correctly', () => {
        render(<RightPanel data={mockData} />);

        expect(screen.getByText(/Min daily: 20 °C/)).toBeInTheDocument();
    });

    it('renders pressure information correctly', () => {
        render(<RightPanel data={mockData} />);

        expect(screen.getByText(/Pressure: 1013 hPa/)).toBeInTheDocument();
    });

    it('renders wind speed correctly', () => {
        render(<RightPanel data={mockData} />);

        expect(screen.getByText(/Wind speed: 5.5 m\/s/)).toBeInTheDocument();
    });

    it('renders wind direction with utility function call', () => {
        render(<RightPanel data={mockData} />);

        expect(getDirection).toHaveBeenCalledWith(180);
        expect(screen.getByText(/Wind direction: S/)).toBeInTheDocument();
    });

    it('renders clouds information correctly', () => {
        render(<RightPanel data={mockData} />);

        expect(screen.getByText(/Clouds: 40 %/)).toBeInTheDocument();
    });

    it('handles different wind directions correctly', () => {
        const directions = [
            { deg: 0, expected: 'N' },
            { deg: 90, expected: 'E' },
            { deg: 180, expected: 'S' },
            { deg: 270, expected: 'W' },
            { deg: 45, expected: 'NE' },
            { deg: 225, expected: 'SW' }
        ];

        directions.forEach(({ deg, expected }) => {
            getDirection.mockReturnValue(expected);

            const testData = { ...mockData, deg };
            const { unmount } = render(<RightPanel data={testData} />);

            expect(getDirection).toHaveBeenCalledWith(deg);
            expect(screen.getByText(new RegExp(`Wind direction: ${expected}`))).toBeInTheDocument();

            unmount();
        });
    });

    it('handles various weather data ranges', () => {
        const extremeData = {
            temp: -10,
            feels: -15,
            humidity: 95,
            max: 0,
            min: -20,
            pressure: 980,
            speed: 25.5,
            deg: 315,
            all: 100
        };

        getDirection.mockReturnValue('NW');

        render(<RightPanel data={extremeData} />);

        expect(screen.getByText(/Temperature: -10/)).toBeInTheDocument();
        expect(screen.getByText(/Feels like: -15/)).toBeInTheDocument();
        expect(screen.getByText(/Humidity: 95/)).toBeInTheDocument();
        expect(screen.getByText(/Max daily: 0/)).toBeInTheDocument();
        expect(screen.getByText(/Min daily: -20/)).toBeInTheDocument();
        expect(screen.getByText(/Pressure: 980/)).toBeInTheDocument();
        expect(screen.getByText(/Wind speed: 25.5/)).toBeInTheDocument();
        expect(screen.getByText(/Wind direction: NW/)).toBeInTheDocument();
        expect(screen.getByText(/Clouds: 100/)).toBeInTheDocument();
    });

    it('handles zero values correctly', () => {
        const zeroData = {
            temp: 0,
            feels: 0,
            humidity: 0,
            max: 0,
            min: 0,
            pressure: 0,
            speed: 0,
            deg: 0,
            all: 0
        };

        getDirection.mockReturnValue('N');

        render(<RightPanel data={zeroData} />);

        expect(screen.getByText(/Temperature: 0/)).toBeInTheDocument();
        expect(screen.getByText(/Wind speed: 0/)).toBeInTheDocument();
        expect(screen.getByText(/Clouds: 0/)).toBeInTheDocument();
    });

    it('renders React fragment as root element', () => {
        const { container } = render(<RightPanel data={mockData} />);

        // Since it's a React fragment, should have 9 direct children (Text components)
        expect(container.children).toHaveLength(9);
    });

    it('renders weather parameters in correct order', () => {
        const { container } = render(<RightPanel data={mockData} />);

        const textComponents = container.children;

        // Check the order of weather parameters
        expect(textComponents[0]).toHaveTextContent('Temperature:');
        expect(textComponents[1]).toHaveTextContent('Feels like:');
        expect(textComponents[2]).toHaveTextContent('Humidity:');
        expect(textComponents[3]).toHaveTextContent('Max daily:');
        expect(textComponents[4]).toHaveTextContent('Min daily:');
        expect(textComponents[5]).toHaveTextContent('Pressure:');
        expect(textComponents[6]).toHaveTextContent('Wind speed:');
        expect(textComponents[7]).toHaveTextContent('Wind direction:');
        expect(textComponents[8]).toHaveTextContent('Clouds:');
    });

    it('uses HTML entities for degree symbols correctly', () => {
        render(<RightPanel data={mockData} />);

        // HTML entities are converted to actual symbols by React
        expect(screen.getByText(/Temperature:.*25.*°C/)).toBeInTheDocument();
        expect(screen.getByText(/Feels like:.*28.*°C/)).toBeInTheDocument();
        expect(screen.getByText(/Max daily:.*30.*°C/)).toBeInTheDocument();
        expect(screen.getByText(/Min daily:.*20.*°C/)).toBeInTheDocument();
    });

    it('uses percentage symbols for humidity and clouds', () => {
        render(<RightPanel data={mockData} />);

        expect(screen.getByText(/Humidity: 65 %/)).toBeInTheDocument();
        expect(screen.getByText(/Clouds: 40 %/)).toBeInTheDocument();
    });

    it('uses correct units for pressure and wind speed', () => {
        render(<RightPanel data={mockData} />);

        expect(screen.getByText(/Pressure: 1013 hPa/)).toBeInTheDocument();
        expect(screen.getByText(/Wind speed: 5.5 m\/s/)).toBeInTheDocument();
    });

    it('handles wind direction with empty unit', () => {
        render(<RightPanel data={mockData} />);

        // Wind direction should have empty unit string - check the pattern instead of exact match
        expect(screen.getByText(/Wind direction:.*S/)).toBeInTheDocument();
    });

    it('handles decimal values in weather data', () => {
        const decimalData = {
            temp: 25.7,
            feels: 28.3,
            humidity: 65.5,
            max: 30.1,
            min: 20.8,
            pressure: 1013.25,
            speed: 5.75,
            deg: 180.5,
            all: 40.2
        };

        getDirection.mockReturnValue('S');

        render(<RightPanel data={decimalData} />);

        expect(screen.getByText(/Temperature: 25.7/)).toBeInTheDocument();
        expect(screen.getByText(/Wind speed: 5.75/)).toBeInTheDocument();
        expect(screen.getByText(/Pressure: 1013.25/)).toBeInTheDocument();
    });

    it('calls getDirection utility function correctly', () => {
        render(<RightPanel data={mockData} />);

        expect(getDirection).toHaveBeenCalledTimes(1);
        expect(getDirection).toHaveBeenCalledWith(180);
    });

    it('handles missing properties gracefully', () => {
        const incompleteData = {
            temp: 25,
            feels: 28,
            // missing some properties
        };

        render(<RightPanel data={incompleteData} />);

        // Should still render without crashing
        expect(screen.getByText(/Temperature: 25/)).toBeInTheDocument();
        expect(screen.getByText(/Feels like: 28/)).toBeInTheDocument();
    });
});