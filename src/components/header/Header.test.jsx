import React from 'react';
import { render } from '@testing-library/react';

// Mock the CSS import
vi.mock('./header-style.css', () => ({}));

// Mock the CityInput component
vi.mock('../city-input/CityInput', () => ({
    default: function MockCityInput() {
        return <div data-testid="city-input">Mock City Input</div>;
    }
}));

import Header from './Header';

describe('Header Component', () => {
    it('renders header with correct CSS class', () => {
        const { container } = render(<Header />);

        const header = container.querySelector('.header');
        expect(header).toBeInTheDocument();
        expect(header).toHaveClass('header');
    });

    it('renders CityInput component inside header', () => {
        const { getByTestId } = render(<Header />);

        expect(getByTestId('city-input')).toBeInTheDocument();
    });

    it('has correct structure with div container', () => {
        const { container } = render(<Header />);

        const headerDiv = container.querySelector('div.header');
        expect(headerDiv).toBeInTheDocument();
        expect(headerDiv.tagName).toBe('DIV');
    });

    it('contains only CityInput as child component', () => {
        const { container } = render(<Header />);

        const header = container.querySelector('.header');
        expect(header.children).toHaveLength(1);
    });

    it('renders without any props', () => {
        expect(() => render(<Header />)).not.toThrow();
    });

    it('maintains simple structure', () => {
        const { container } = render(<Header />);

        // Should have a single div with class 'header' containing CityInput
        expect(container.firstChild).toHaveClass('header');
        expect(container.firstChild.children).toHaveLength(1);
    });

    it('imports and uses CityInput correctly', () => {
        const { getByTestId } = render(<Header />);

        // Verify that CityInput is rendered
        const cityInput = getByTestId('city-input');
        expect(cityInput).toBeInTheDocument();
        expect(cityInput.textContent).toBe('Mock City Input');
    });

    it('applies header class for styling', () => {
        const { container } = render(<Header />);

        const headerElement = container.querySelector('.header');
        expect(headerElement).toHaveClass('header');
    });
});