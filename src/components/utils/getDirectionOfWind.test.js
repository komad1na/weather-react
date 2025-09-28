import getDirection from './getDirectionOfWind';

describe('getDirectionOfWind', () => {
    it('returns "N" for north directions (348.75-360 and 0-11.25)', () => {
        expect(getDirection(0)).toBe('N');
        expect(getDirection(11.24)).toBe('N');
        expect(getDirection(349)).toBe('N');
        expect(getDirection(360)).toBe('N');
    });

    it('returns "NNE" for north-northeast directions (11.25-33.75)', () => {
        expect(getDirection(11.26)).toBe('NNE');
        expect(getDirection(22.5)).toBe('NNE');
        expect(getDirection(33.75)).toBe('NNE');
    });

    it('returns "NE" for northeast directions (33.75-56.25)', () => {
        expect(getDirection(33.76)).toBe('NE');
        expect(getDirection(45)).toBe('NE');
        expect(getDirection(56.25)).toBe('NE');
    });

    it('returns "ENE" for east-northeast directions (56.25-78.75)', () => {
        expect(getDirection(56.26)).toBe('ENE');
        expect(getDirection(67.5)).toBe('ENE');
        expect(getDirection(78.75)).toBe('ENE');
    });

    it('returns "E" for east directions (78.75-101.25)', () => {
        expect(getDirection(78.76)).toBe('E');
        expect(getDirection(90)).toBe('E');
        expect(getDirection(101.25)).toBe('E');
    });

    it('returns "ESE" for east-southeast directions (101.25-123.75)', () => {
        expect(getDirection(101.26)).toBe('ESE');
        expect(getDirection(112.5)).toBe('ESE');
        expect(getDirection(123.75)).toBe('ESE');
    });

    it('returns "SE" for southeast directions (123.75-146.25)', () => {
        expect(getDirection(123.76)).toBe('SE');
        expect(getDirection(135)).toBe('SE');
        expect(getDirection(146.25)).toBe('SE');
    });

    it('returns "SSE" for south-southeast directions (146.25-168.75)', () => {
        expect(getDirection(146.26)).toBe('SSE');
        expect(getDirection(157.5)).toBe('SSE');
        expect(getDirection(168.75)).toBe('SSE');
    });

    it('returns "S" for south directions (168.75-191.25)', () => {
        expect(getDirection(168.76)).toBe('S');
        expect(getDirection(180)).toBe('S');
        expect(getDirection(191.25)).toBe('S');
    });

    it('returns "SSW" for south-southwest directions (191.25-213.75)', () => {
        expect(getDirection(191.26)).toBe('SSW');
        expect(getDirection(202.5)).toBe('SSW');
        expect(getDirection(213.75)).toBe('SSW');
    });

    it('returns "SW" for southwest directions (213.75-236.25)', () => {
        expect(getDirection(213.76)).toBe('SW');
        expect(getDirection(225)).toBe('SW');
        expect(getDirection(236.25)).toBe('SW');
    });

    it('returns "WSW" for west-southwest directions (>236.25-258.75)', () => {
        expect(getDirection(236.26)).toBe('WSW');
        expect(getDirection(247.5)).toBe('WSW');
        expect(getDirection(258.75)).toBe('WSW');
    });

    it('returns "W" for west directions (258.75-281.25)', () => {
        expect(getDirection(258.76)).toBe('W');
        expect(getDirection(270)).toBe('W');
        expect(getDirection(281.25)).toBe('W');
    });

    it('returns "WNW" for west-northwest directions (281.25-303.75)', () => {
        expect(getDirection(281.26)).toBe('WNW');
        expect(getDirection(292.5)).toBe('WNW');
        expect(getDirection(303.75)).toBe('WNW');
    });

    it('returns "NW" for northwest directions (303.75-326.25)', () => {
        expect(getDirection(303.76)).toBe('NW');
        expect(getDirection(315)).toBe('NW');
        expect(getDirection(326.25)).toBe('NW');
    });

    it('returns "NNW" for north-northwest directions (326.25-348.75)', () => {
        expect(getDirection(326.26)).toBe('NNW');
        expect(getDirection(337.5)).toBe('NNW');
        expect(getDirection(348.75)).toBe('NNW');
    });

    it('handles boundary values correctly', () => {
        expect(getDirection(11.25)).toBe(''); // 11.25 is not included in any range
        expect(getDirection(11.26)).toBe('NNE');
        expect(getDirection(348.75)).toBe('NNW');
        expect(getDirection(348.76)).toBe('N');
    });

    it('handles boundary between SW and WSW ranges', () => {
        // SW range ends at 236.25, WSW range starts > 236.25
        expect(getDirection(236.25)).toBe('SW'); // Exactly at SW boundary
        expect(getDirection(236.26)).toBe('WSW'); // Just above boundary, so WSW
    });

    it('handles exact cardinal directions', () => {
        expect(getDirection(0)).toBe('N');
        expect(getDirection(90)).toBe('E');
        expect(getDirection(180)).toBe('S');
        expect(getDirection(270)).toBe('W');
    });

    it('returns empty string for invalid ranges (edge case)', () => {
        // Test a gap in the logic if any - though the current logic should cover all 360 degrees
        // This tests the default case behavior
        expect(getDirection(-1)).toBe('');
        expect(getDirection(361)).toBe('');
    });

    it('handles decimal degrees correctly', () => {
        expect(getDirection(45.5)).toBe('NE');
        expect(getDirection(225.7)).toBe('SW');
        expect(getDirection(359.9)).toBe('N');
    });
});