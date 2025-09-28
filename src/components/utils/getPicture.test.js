import getPicture from './getPicture';

describe('getPicture', () => {
    it('returns correct OpenWeatherMap icon URL for given icon code', () => {
        const iconCode = '01d';
        const expectedURL = 'https://openweathermap.org/img/wn/01d@2x.png';

        expect(getPicture(iconCode)).toBe(expectedURL);
    });

    it('handles different icon codes correctly', () => {
        const testCases = [
            { icon: '01d', expected: 'https://openweathermap.org/img/wn/01d@2x.png' },
            { icon: '01n', expected: 'https://openweathermap.org/img/wn/01n@2x.png' },
            { icon: '02d', expected: 'https://openweathermap.org/img/wn/02d@2x.png' },
            { icon: '02n', expected: 'https://openweathermap.org/img/wn/02n@2x.png' },
            { icon: '03d', expected: 'https://openweathermap.org/img/wn/03d@2x.png' },
            { icon: '03n', expected: 'https://openweathermap.org/img/wn/03n@2x.png' },
            { icon: '04d', expected: 'https://openweathermap.org/img/wn/04d@2x.png' },
            { icon: '04n', expected: 'https://openweathermap.org/img/wn/04n@2x.png' },
            { icon: '09d', expected: 'https://openweathermap.org/img/wn/09d@2x.png' },
            { icon: '09n', expected: 'https://openweathermap.org/img/wn/09n@2x.png' },
            { icon: '10d', expected: 'https://openweathermap.org/img/wn/10d@2x.png' },
            { icon: '10n', expected: 'https://openweathermap.org/img/wn/10n@2x.png' },
            { icon: '11d', expected: 'https://openweathermap.org/img/wn/11d@2x.png' },
            { icon: '11n', expected: 'https://openweathermap.org/img/wn/11n@2x.png' },
            { icon: '13d', expected: 'https://openweathermap.org/img/wn/13d@2x.png' },
            { icon: '13n', expected: 'https://openweathermap.org/img/wn/13n@2x.png' },
            { icon: '50d', expected: 'https://openweathermap.org/img/wn/50d@2x.png' },
            { icon: '50n', expected: 'https://openweathermap.org/img/wn/50n@2x.png' }
        ];

        testCases.forEach(({ icon, expected }) => {
            expect(getPicture(icon)).toBe(expected);
        });
    });

    it('handles clear sky day icon', () => {
        expect(getPicture('01d')).toBe('https://openweathermap.org/img/wn/01d@2x.png');
    });

    it('handles clear sky night icon', () => {
        expect(getPicture('01n')).toBe('https://openweathermap.org/img/wn/01n@2x.png');
    });

    it('handles partly cloudy day icon', () => {
        expect(getPicture('02d')).toBe('https://openweathermap.org/img/wn/02d@2x.png');
    });

    it('handles rain day icon', () => {
        expect(getPicture('10d')).toBe('https://openweathermap.org/img/wn/10d@2x.png');
    });

    it('handles thunderstorm icon', () => {
        expect(getPicture('11d')).toBe('https://openweathermap.org/img/wn/11d@2x.png');
    });

    it('handles snow icon', () => {
        expect(getPicture('13d')).toBe('https://openweathermap.org/img/wn/13d@2x.png');
    });

    it('handles mist icon', () => {
        expect(getPicture('50d')).toBe('https://openweathermap.org/img/wn/50d@2x.png');
    });

    it('handles empty string input', () => {
        expect(getPicture('')).toBe('https://openweathermap.org/img/wn/@2x.png');
    });

    it('handles null input gracefully', () => {
        expect(getPicture(null)).toBe('https://openweathermap.org/img/wn/null@2x.png');
    });

    it('handles undefined input gracefully', () => {
        expect(getPicture(undefined)).toBe('https://openweathermap.org/img/wn/undefined@2x.png');
    });

    it('always returns URL with @2x resolution', () => {
        const result = getPicture('01d');
        expect(result).toContain('@2x.png');
    });

    it('always returns HTTPS URL', () => {
        const result = getPicture('01d');
        expect(result.startsWith('https://')).toBe(true);
    });

    it('always points to openweathermap.org domain', () => {
        const result = getPicture('01d');
        expect(result).toContain('openweathermap.org');
    });

    it('constructs URL with proper path structure', () => {
        const result = getPicture('01d');
        expect(result).toContain('/img/wn/');
    });
});