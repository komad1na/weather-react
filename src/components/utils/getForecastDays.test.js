import { getForecastDays } from './getForecastDays';

// Mock the getDateTime function
vi.mock('./getDateTime', () => ({
    getDateTime: vi.fn()
}));

import { getDateTime } from './getDateTime';

describe('getForecastDays', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('returns empty array when input is not an array', () => {
        expect(getForecastDays(null)).toEqual([]);
        expect(getForecastDays(undefined)).toEqual([]);
        expect(getForecastDays({})).toEqual([]);
        expect(getForecastDays('string')).toEqual([]);
        expect(getForecastDays(123)).toEqual([]);
    });

    it('returns empty array when input array is empty', () => {
        expect(getForecastDays([])).toEqual([]);
    });

    it('groups forecast data by day correctly', () => {
        const mockData = [
            { dt: 1641038400, temp: 15 }, // Day 1
            { dt: 1641049200, temp: 18 }, // Day 1 (same day)
            { dt: 1641060000, temp: 20 }, // Day 1 (same day)
            { dt: 1641124800, temp: 12 }, // Day 2
            { dt: 1641135600, temp: 14 }, // Day 2 (same day)
        ];

        // Mock getDateTime to return dates based on timestamp
        getDateTime.mockImplementation((timestamp) => {
            if (timestamp === 1641038400 || timestamp === 1641049200 || timestamp === 1641060000) {
                return '01.01.2022';
            } else if (timestamp === 1641124800 || timestamp === 1641135600) {
                return '02.01.2022';
            }
            return '01.01.2022'; // fallback
        });

        const result = getForecastDays(mockData);

        expect(result).toHaveLength(2);
        expect(result[0]).toHaveLength(3); // First day has 3 items
        expect(result[1]).toHaveLength(2); // Second day has 2 items

        expect(result[0]).toEqual([
            { dt: 1641038400, temp: 15 },
            { dt: 1641049200, temp: 18 },
            { dt: 1641060000, temp: 20 }
        ]);
        expect(result[1]).toEqual([
            { dt: 1641124800, temp: 12 },
            { dt: 1641135600, temp: 14 }
        ]);
    });

    it('handles single day data correctly', () => {
        const mockData = [
            { dt: 1641038400, temp: 15 },
            { dt: 1641049200, temp: 18 },
            { dt: 1641060000, temp: 20 }
        ];

        getDateTime.mockImplementation(() => '01.01.2022');

        const result = getForecastDays(mockData);

        expect(result).toHaveLength(1);
        expect(result[0]).toHaveLength(3);
        expect(result[0]).toEqual(mockData);
    });

    it('handles single item array correctly', () => {
        const mockData = [{ dt: 1641038400, temp: 15 }];

        getDateTime.mockReturnValue('01.01.2022');

        const result = getForecastDays(mockData);

        expect(result).toHaveLength(1);
        expect(result[0]).toHaveLength(1);
        expect(result[0]).toEqual([{ dt: 1641038400, temp: 15 }]);
    });

    it('correctly processes day boundaries', () => {
        const mockData = [
            { dt: 1641038400, temp: 15 }, // Day 1
            { dt: 1641124800, temp: 12 }, // Day 2
            { dt: 1641211200, temp: 10 }, // Day 3
        ];

        getDateTime
            .mockReturnValueOnce('01.01.2022') // First item
            .mockReturnValueOnce('02.01.2022') // Second item comparison (different day)
            .mockReturnValueOnce('01.01.2022') // First item of first group
            .mockReturnValueOnce('03.01.2022') // Third item comparison (different day)
            .mockReturnValueOnce('02.01.2022'); // First item of second group

        const result = getForecastDays(mockData);

        expect(result).toHaveLength(3);
        expect(result[0]).toEqual([{ dt: 1641038400, temp: 15 }]);
        expect(result[1]).toEqual([{ dt: 1641124800, temp: 12 }]);
        expect(result[2]).toEqual([{ dt: 1641211200, temp: 10 }]);
    });

    it('uses day part of date for comparison', () => {
        const mockData = [
            { dt: 1641038400, weather: 'sunny' },
            { dt: 1641049200, weather: 'cloudy' }
        ];

        // Mock returns dates where day part is extracted by splitting on '.'
        getDateTime
            .mockReturnValueOnce('01.01.2022') // First item
            .mockReturnValueOnce('01.01.2022') // Second item comparison (same day)
            .mockReturnValueOnce('01.01.2022'); // First item comparison for grouping

        const result = getForecastDays(mockData);

        expect(result).toHaveLength(1);
        expect(result[0]).toHaveLength(2);

        // Verify that getDateTime was called for day extraction
        expect(getDateTime).toHaveBeenCalledWith(1641038400);
        expect(getDateTime).toHaveBeenCalledWith(1641049200);
    });

    it('handles complex multi-day scenario', () => {
        const mockData = [
            { dt: 1641038400, hour: '12:00' }, // Day 1
            { dt: 1641049200, hour: '15:00' }, // Day 1
            { dt: 1641060000, hour: '18:00' }, // Day 1
            { dt: 1641124800, hour: '09:00' }, // Day 2
            { dt: 1641135600, hour: '12:00' }, // Day 2
            { dt: 1641146400, hour: '15:00' }, // Day 2
            { dt: 1641157200, hour: '18:00' }, // Day 2
            { dt: 1641211200, hour: '09:00' }, // Day 3
        ];

        // Mock getDateTime to return dates based on timestamp ranges
        getDateTime.mockImplementation((timestamp) => {
            if (timestamp >= 1641038400 && timestamp <= 1641060000) {
                return '01.01.2022'; // Day 1
            } else if (timestamp >= 1641124800 && timestamp <= 1641157200) {
                return '02.01.2022'; // Day 2
            } else if (timestamp >= 1641211200) {
                return '03.01.2022'; // Day 3
            }
            return '01.01.2022'; // fallback
        });

        const result = getForecastDays(mockData);

        expect(result).toHaveLength(3);
        expect(result[0]).toHaveLength(3); // Day 1: 3 items
        expect(result[1]).toHaveLength(4); // Day 2: 4 items
        expect(result[2]).toHaveLength(1); // Day 3: 1 item
    });

    it('preserves original data structure in groups', () => {
        const mockData = [
            { dt: 1641038400, weather: { main: 'Clear', description: 'clear sky' }, temp: 15 },
            { dt: 1641049200, weather: { main: 'Clouds', description: 'few clouds' }, temp: 18 },
        ];

        getDateTime.mockImplementation(() => '01.01.2022');

        const result = getForecastDays(mockData);

        expect(result[0][0]).toEqual(mockData[0]);
        expect(result[0][1]).toEqual(mockData[1]);

        // Verify nested objects are preserved
        expect(result[0][0].weather.main).toBe('Clear');
        expect(result[0][1].weather.description).toBe('few clouds');
    });

    it('handles edge case with data missing dt property gracefully', () => {
        const mockData = [
            { dt: 1641038400, temp: 15 },
            { temp: 18 }, // Missing dt property
            { dt: 1641124800, temp: 12 },
        ];

        // The function should still work, getDateTime might return something for undefined
        getDateTime
            .mockReturnValueOnce('01.01.2022')
            .mockReturnValueOnce('invalid')
            .mockReturnValueOnce('01.01.2022')
            .mockReturnValueOnce('02.01.2022')
            .mockReturnValueOnce('invalid')
            .mockReturnValueOnce('02.01.2022');

        expect(() => getForecastDays(mockData)).not.toThrow();

        const result = getForecastDays(mockData);
        expect(Array.isArray(result)).toBe(true);
    });

    it('calls getDateTime with correct parameters', () => {
        const mockData = [
            { dt: 1641038400, temp: 15 },
            { dt: 1641049200, temp: 18 }
        ];

        getDateTime
            .mockReturnValueOnce('01.01.2022')
            .mockReturnValueOnce('01.01.2022')
            .mockReturnValueOnce('01.01.2022');

        getForecastDays(mockData);

        expect(getDateTime).toHaveBeenCalledWith(1641038400);
        expect(getDateTime).toHaveBeenCalledWith(1641049200);
    });
});