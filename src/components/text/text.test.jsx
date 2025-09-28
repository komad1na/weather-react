import React from 'react';
import { render, screen } from '@testing-library/react';

import Text from './text';

describe('Text Component', () => {
    it('renders text component with correct structure', () => {
        const { container } = render(
            <Text frontText="Temperature:" dataText="25" unit="°C" />
        );

        const textHolder = container.querySelector('.textholder');
        expect(textHolder).toBeInTheDocument();
    });

    it('displays front text correctly', () => {
        render(<Text frontText="Temperature:" dataText="25" unit="°C" />);

        expect(screen.getByText(/Temperature:/)).toBeInTheDocument();
    });

    it('displays data text in bold', () => {
        render(<Text frontText="Temperature:" dataText="25" unit="°C" />);

        const boldElement = screen.getByText('25 °C');
        expect(boldElement.tagName).toBe('B');
    });

    it('displays unit correctly', () => {
        render(<Text frontText="Temperature:" dataText="25" unit="°C" />);

        expect(screen.getByText('25 °C')).toBeInTheDocument();
    });

    it('handles different data types for dataText', () => {
        const testCases = [
            { dataText: 25, expected: '25' },
            { dataText: '25', expected: '25' },
            { dataText: 0, expected: '0' },
            { dataText: '---', expected: '---' }
        ];

        testCases.forEach(({ dataText, expected }) => {
            const { unmount } = render(
                <Text frontText="Value:" dataText={dataText} unit="unit" />
            );

            expect(screen.getByText(`${expected} unit`)).toBeInTheDocument();
            unmount();
        });
    });

    it('handles empty unit gracefully', () => {
        render(<Text frontText="Status:" dataText="Active" unit="" />);

        expect(screen.getByText('Active')).toBeInTheDocument();
        // Should still render with space after the data text
        const boldElement = screen.getByText('Active');
        expect(boldElement.tagName).toBe('B');
    });

    it('handles missing unit prop', () => {
        render(<Text frontText="Status:" dataText="Active" />);

        expect(screen.getByText('Active')).toBeInTheDocument();
    });

    it('renders with space between front text and bold section', () => {
        const { container } = render(
            <Text frontText="Temperature:" dataText="25" unit="°C" />
        );

        // Check that there's a space between front text and the bold section
        const textContent = container.textContent;
        expect(textContent).toContain('Temperature: 25 °C');
    });

    it('handles various weather data scenarios', () => {
        const weatherScenarios = [
            { frontText: 'Temperature:', dataText: '15', unit: '°C' },
            { frontText: 'Feels like:', dataText: '18', unit: '°C' },
            { frontText: 'Humidity:', dataText: '65', unit: '%' },
            { frontText: 'Pressure:', dataText: '1013', unit: 'hPa' },
            { frontText: 'Wind speed:', dataText: '5.5', unit: 'm/s' },
            { frontText: 'Wind direction:', dataText: 'NW', unit: '' },
            { frontText: 'Clouds:', dataText: '20', unit: '%' }
        ];

        weatherScenarios.forEach(({ frontText, dataText, unit }, index) => {
            const { unmount } = render(
                <Text frontText={frontText} dataText={dataText} unit={unit} />
            );

            expect(screen.getByText(new RegExp(frontText))).toBeInTheDocument();
            expect(screen.getByText(`${dataText}${unit ? ` ${unit}` : ''}`)).toBeInTheDocument();

            unmount();
        });
    });

    it('handles special characters in data', () => {
        render(<Text frontText="Special:" dataText="25°" unit="C" />);

        expect(screen.getByText('Special:')).toBeInTheDocument();
        expect(screen.getByText('25° C')).toBeInTheDocument();
    });

    it('handles long text values', () => {
        const longText = 'This is a very long description text';
        render(<Text frontText="Description:" dataText={longText} unit="" />);

        expect(screen.getByText('Description:')).toBeInTheDocument();
        expect(screen.getByText(longText)).toBeInTheDocument();
    });

    it('handles numeric zero values correctly', () => {
        render(<Text frontText="Count:" dataText={0} unit="items" />);

        expect(screen.getByText('Count:')).toBeInTheDocument();
        expect(screen.getByText('0 items')).toBeInTheDocument();
    });

    it('handles negative values correctly', () => {
        render(<Text frontText="Temperature:" dataText="-5" unit="°C" />);

        expect(screen.getByText('Temperature:')).toBeInTheDocument();
        expect(screen.getByText('-5 °C')).toBeInTheDocument();
    });

    it('maintains correct CSS class on container', () => {
        const { container } = render(
            <Text frontText="Test:" dataText="value" unit="unit" />
        );

        const textHolder = container.querySelector('.textholder');
        expect(textHolder).toHaveClass('textholder');
    });

    it('renders data and unit with proper spacing', () => {
        render(<Text frontText="Speed:" dataText="10" unit="km/h" />);

        // Data and unit should be separated by space
        expect(screen.getByText('10 km/h')).toBeInTheDocument();
    });

    it('handles HTML entities in unit prop', () => {
        render(<Text frontText="Temperature:" dataText="25" unit="&#176;C" />);

        // HTML entities are rendered as actual characters by React
        expect(screen.getByText('25 °C')).toBeInTheDocument();
    });

    it('preserves all text content in correct order', () => {
        const { container } = render(
            <Text frontText="Wind:" dataText="15" unit="m/s" />
        );

        const fullText = container.textContent;
        expect(fullText.trim()).toBe('Wind: 15 m/s');
    });
});