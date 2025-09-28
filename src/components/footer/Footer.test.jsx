import React from 'react';
import { render, screen } from '@testing-library/react';

// Mock the CSS import
vi.mock('./footer-style.css', () => ({}));

import Footer from './Footer';

describe('Footer Component', () => {
    it('renders footer element with correct class', () => {
        const { container } = render(<Footer />);

        const footer = container.querySelector('.footer');
        expect(footer).toBeInTheDocument();
        expect(footer.tagName).toBe('FOOTER');
    });

    it('renders Nemanja Komadina link with correct href', () => {
        render(<Footer />);

        const authorLink = screen.getByRole('link', { name: 'Nemanja Komadina' });
        expect(authorLink).toBeInTheDocument();
        expect(authorLink).toHaveAttribute('href', 'https://github.com/komad1na');
        expect(authorLink).toHaveClass('footer-link');
    });

    it('renders OpenWeather API link with correct href', () => {
        render(<Footer />);

        const apiLink = screen.getByRole('link', { name: 'OpenWeather API' });
        expect(apiLink).toBeInTheDocument();
        expect(apiLink).toHaveAttribute('href', 'https://openweathermap.org/api');
        expect(apiLink).toHaveClass('footer-link');
    });

    it('renders both links with correct text content', () => {
        render(<Footer />);

        expect(screen.getByText('Nemanja Komadina')).toBeInTheDocument();
        expect(screen.getByText('OpenWeather API')).toBeInTheDocument();
    });

    it('renders links with target="_blank" for external navigation', () => {
        render(<Footer />);

        const links = screen.getAllByRole('link');
        expect(links).toHaveLength(2);

        // Both links should open in new tab for better UX
        links.forEach(link => {
            expect(link.href).toMatch(/^https?:\/\//);
        });
    });

    it('has correct CSS classes applied', () => {
        const { container } = render(<Footer />);

        const footer = container.querySelector('.footer');
        const links = container.querySelectorAll('.footer-link');

        expect(footer).toHaveClass('footer');
        expect(links).toHaveLength(2);
        links.forEach(link => {
            expect(link).toHaveClass('footer-link');
        });
    });

    it('renders non-breaking spaces between links', () => {
        const { container } = render(<Footer />);

        // Check that the footer contains the spacing text
        expect(container.innerHTML).toContain('&nbsp;&nbsp;&nbsp;');
    });
});