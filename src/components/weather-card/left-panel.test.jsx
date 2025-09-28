import React from 'react';
import { render, screen } from '@testing-library/react';

// Mock utility function
vi.mock('../utils/getPicture', () => ({
    default: vi.fn()
}));

import LeftPanel from './left-panel';
import getPicture from '../utils/getPicture';

describe('LeftPanel Component', () => {
    const mockData = {
        name: 'London',
        icon: '01d',
        desc: 'Clear sky'
    };

    beforeEach(() => {
        vi.clearAllMocks();
        getPicture.mockReturnValue('https://openweathermap.org/img/wn/01d@2x.png');
    });

    it('renders city name correctly', () => {
        render(<LeftPanel data={mockData} />);

        expect(screen.getByText('London')).toBeInTheDocument();
    });

    it('applies correct CSS class to city name', () => {
        const { container } = render(<LeftPanel data={mockData} />);

        const cityName = container.querySelector('.city-name');
        expect(cityName).toBeInTheDocument();
        expect(cityName).toHaveTextContent('London');
        expect(cityName).toHaveClass('city-name');
    });

    it('renders weather icon with correct src and alt', () => {
        render(<LeftPanel data={mockData} />);

        expect(getPicture).toHaveBeenCalledWith('01d');

        const weatherIcon = screen.getByAltText('icon');
        expect(weatherIcon).toBeInTheDocument();
        expect(weatherIcon).toHaveAttribute('src', 'https://openweathermap.org/img/wn/01d@2x.png');
        expect(weatherIcon).toHaveClass('image');
    });

    it('renders weather description correctly', () => {
        render(<LeftPanel data={mockData} />);

        expect(screen.getByText('Clear sky')).toBeInTheDocument();
    });

    it('applies correct CSS class to weather description', () => {
        const { container } = render(<LeftPanel data={mockData} />);

        const description = container.querySelector('.descriptionIcon');
        expect(description).toBeInTheDocument();
        expect(description).toHaveTextContent('Clear sky');
        expect(description).toHaveClass('descriptionIcon');
    });

    it('renders icon container with correct structure', () => {
        const { container } = render(<LeftPanel data={mockData} />);

        const iconContainer = container.querySelector('.icon');
        expect(iconContainer).toBeInTheDocument();
        expect(iconContainer).toHaveClass('icon');

        // Should contain both image and description
        expect(iconContainer.querySelector('.image')).toBeInTheDocument();
        expect(iconContainer.querySelector('.descriptionIcon')).toBeInTheDocument();
    });

    it('handles different weather conditions', () => {
        const rainyData = {
            name: 'Paris',
            icon: '10d',
            desc: 'Light rain'
        };

        getPicture.mockReturnValue('https://openweathermap.org/img/wn/10d@2x.png');

        render(<LeftPanel data={rainyData} />);

        expect(getPicture).toHaveBeenCalledWith('10d');
        expect(screen.getByText('Paris')).toBeInTheDocument();
        expect(screen.getByText('Light rain')).toBeInTheDocument();

        const weatherIcon = screen.getByAltText('icon');
        expect(weatherIcon).toHaveAttribute('src', 'https://openweathermap.org/img/wn/10d@2x.png');
    });

    it('handles different city names', () => {
        const testCities = [
            { name: 'New York', icon: '01d', desc: 'Clear' },
            { name: 'São Paulo', icon: '02d', desc: 'Partly cloudy' },
            { name: 'Mumbai', icon: '03d', desc: 'Cloudy' },
            { name: 'London-on-Thames', icon: '04d', desc: 'Overcast' }
        ];

        testCities.forEach((cityData) => {
            const { unmount } = render(<LeftPanel data={cityData} />);

            expect(screen.getByText(cityData.name)).toBeInTheDocument();
            expect(screen.getByText(cityData.desc)).toBeInTheDocument();

            unmount();
        });
    });

    it('handles various weather descriptions', () => {
        const weatherConditions = [
            { name: 'City1', icon: '01d', desc: 'Clear sky' },
            { name: 'City2', icon: '02d', desc: 'Few clouds' },
            { name: 'City3', icon: '03d', desc: 'Scattered clouds' },
            { name: 'City4', icon: '04d', desc: 'Broken clouds' },
            { name: 'City5', icon: '09d', desc: 'Shower rain' },
            { name: 'City6', icon: '10d', desc: 'Rain' },
            { name: 'City7', icon: '11d', desc: 'Thunderstorm' },
            { name: 'City8', icon: '13d', desc: 'Snow' },
            { name: 'City9', icon: '50d', desc: 'Mist' }
        ];

        weatherConditions.forEach((condition) => {
            const { unmount } = render(<LeftPanel data={condition} />);

            expect(screen.getByText(condition.desc)).toBeInTheDocument();
            expect(getPicture).toHaveBeenCalledWith(condition.icon);

            unmount();
        });
    });

    it('renders React fragment as root element', () => {
        const { container } = render(<LeftPanel data={mockData} />);

        // Since it's a React fragment, the container should directly contain the children
        expect(container.children).toHaveLength(2); // city-name div and icon div
        expect(container.querySelector('.city-name')).toBeInTheDocument();
        expect(container.querySelector('.icon')).toBeInTheDocument();
    });

    it('handles empty or missing data gracefully', () => {
        const emptyData = {
            name: '',
            icon: '',
            desc: ''
        };

        const { container } = render(<LeftPanel data={emptyData} />);

        expect(getPicture).toHaveBeenCalledWith('');

        // Should still render structure even with empty data
        const cityNameEl = container.querySelector('.city-name');
        expect(cityNameEl).toBeInTheDocument();
        expect(cityNameEl.textContent).toBe('');
        expect(screen.getByAltText('icon')).toBeInTheDocument(); // Icon with empty src
    });

    it('handles special characters in city names and descriptions', () => {
        const specialCharData = {
            name: 'München & Zürich',
            icon: '01d',
            desc: 'Partly cloudy with 25°C'
        };

        render(<LeftPanel data={specialCharData} />);

        expect(screen.getByText('München & Zürich')).toBeInTheDocument();
        expect(screen.getByText('Partly cloudy with 25°C')).toBeInTheDocument();
    });

    it('calls getPicture with correct icon parameter', () => {
        render(<LeftPanel data={mockData} />);

        expect(getPicture).toHaveBeenCalledTimes(1);
        expect(getPicture).toHaveBeenCalledWith('01d');
    });

    it('renders all components in correct hierarchy', () => {
        const { container } = render(<LeftPanel data={mockData} />);

        // First child should be city-name
        expect(container.children[0]).toHaveClass('city-name');

        // Second child should be icon container
        expect(container.children[1]).toHaveClass('icon');

        // Icon container should have image and description
        const iconContainer = container.children[1];
        expect(iconContainer.children[0]).toHaveClass('image');
        expect(iconContainer.children[1]).toHaveClass('descriptionIcon');
    });

    it('maintains proper semantic structure for accessibility', () => {
        render(<LeftPanel data={mockData} />);

        // Image should have alt text
        const image = screen.getByAltText('icon');
        expect(image).toBeInTheDocument();

        // City name should be readable text
        expect(screen.getByText('London')).toBeInTheDocument();

        // Description should be readable text
        expect(screen.getByText('Clear sky')).toBeInTheDocument();
    });
});