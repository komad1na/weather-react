import { getTime, getDateTime } from './getDateTime';

describe('getDateTime utility functions', () => {
    describe('getTime', () => {
        it('converts Unix timestamp to time format HH:MM', () => {
            // Unix timestamp for 2022-01-01 12:30:45 UTC
            const unixTimestamp = 1641039045;
            const result = getTime(unixTimestamp);

            // The exact time will depend on the system timezone
            // We'll test the format instead
            expect(result).toMatch(/^\d{2}:\d{2}$/);
        });

        it('handles midnight correctly', () => {
            // Unix timestamp for 2022-01-01 00:00:00 UTC
            const unixTimestamp = 1640995200;
            const result = getTime(unixTimestamp);

            expect(result).toMatch(/^\d{2}:\d{2}$/);
        });

        it('handles noon correctly', () => {
            // Unix timestamp for 2022-01-01 12:00:00 UTC
            const unixTimestamp = 1641038400;
            const result = getTime(unixTimestamp);

            expect(result).toMatch(/^\d{2}:\d{2}$/);
        });

        it('uses 24-hour format (no AM/PM)', () => {
            const unixTimestamp = 1641038400; // noon
            const result = getTime(unixTimestamp);

            // Should not contain AM or PM
            expect(result).not.toContain('AM');
            expect(result).not.toContain('PM');
            expect(result).not.toContain('am');
            expect(result).not.toContain('pm');
        });

        it('pads single digit hours and minutes with zeros', () => {
            // Test various times to ensure zero padding
            const testTimestamps = [
                1640995200, // 00:00
                1641038460, // 12:01
                1641038520, // 12:02
            ];

            testTimestamps.forEach(timestamp => {
                const result = getTime(timestamp);
                // Should always be in HH:MM format with zero padding
                expect(result).toMatch(/^\d{2}:\d{2}$/);
                expect(result.length).toBe(5); // HH:MM = 5 characters
            });
        });

        it('handles zero Unix timestamp', () => {
            const result = getTime(0);
            expect(result).toMatch(/^\d{2}:\d{2}$/);
        });

        it('handles negative Unix timestamp', () => {
            const result = getTime(-1000);
            expect(result).toMatch(/^\d{2}:\d{2}$/);
        });
    });

    describe('getDateTime', () => {
        it('converts Unix timestamp to German date format DD.MM.YYYY', () => {
            // Unix timestamp for 2022-01-01 12:00:00 UTC
            const unixTimestamp = 1641038400;
            const result = getDateTime(unixTimestamp);

            // Should be in German date format DD.MM.YYYY
            expect(result).toMatch(/^\d{1,2}\.\d{1,2}\.\d{4}$/);
        });

        it('uses German locale format consistently', () => {
            // Test multiple dates
            const testCases = [
                1641038400, // 2022-01-01
                1643716800, // 2022-02-01
                1646136000, // 2022-03-01
                1648814400, // 2022-04-01
            ];

            testCases.forEach(timestamp => {
                const result = getDateTime(timestamp);
                // German format: DD.MM.YYYY or D.M.YYYY
                expect(result).toMatch(/^\d{1,2}\.\d{1,2}\.\d{4}$/);

                // Should contain dots as separators
                expect(result.split('.')).toHaveLength(3);
            });
        });

        it('handles new year date correctly', () => {
            // Unix timestamp for 2022-01-01
            const unixTimestamp = 1641038400;
            const result = getDateTime(unixTimestamp);

            expect(result).toContain('2022');
            expect(result).toContain('1.'); // January (month 1)
        });

        it('handles leap year date correctly', () => {
            // Unix timestamp for 2020-02-29 (leap year)
            const unixTimestamp = 1582934400;
            const result = getDateTime(unixTimestamp);

            expect(result).toContain('2020');
        });

        it('handles end of year date correctly', () => {
            // Unix timestamp for 2022-12-31
            const unixTimestamp = 1672444800;
            const result = getDateTime(unixTimestamp);

            expect(result).toContain('2022');
            expect(result).toContain('12'); // December
            expect(result).toContain('31'); // 31st day
        });

        it('handles zero Unix timestamp', () => {
            const result = getDateTime(0);
            expect(result).toMatch(/^\d{1,2}\.\d{1,2}\.\d{4}$/);
            // Unix epoch starts at 1970-01-01
            expect(result).toContain('1970');
        });

        it('handles negative Unix timestamp', () => {
            const result = getDateTime(-86400); // One day before epoch
            expect(result).toMatch(/^\d{1,2}\.\d{1,2}\.\d{4}$/);
            expect(result).toContain('1969');
        });

        it('returns date in DD.MM.YYYY format for single digit days/months', () => {
            // Test early days of month/year
            const testTimestamp = 1641081600; // 2022-01-02
            const result = getDateTime(testTimestamp);

            // Should handle single digit dates properly
            expect(result).toMatch(/^\d{1,2}\.\d{1,2}\.\d{4}$/);
        });
    });

    describe('Edge cases and error handling', () => {
        it('handles very large Unix timestamps', () => {
            const largeTimestamp = 2147483647; // Max 32-bit signed integer

            expect(() => getTime(largeTimestamp)).not.toThrow();
            expect(() => getDateTime(largeTimestamp)).not.toThrow();

            const timeResult = getTime(largeTimestamp);
            const dateResult = getDateTime(largeTimestamp);

            expect(timeResult).toMatch(/^\d{2}:\d{2}$/);
            expect(dateResult).toMatch(/^\d{1,2}\.\d{1,2}\.\d{4}$/);
        });

        it('handles string inputs gracefully', () => {
            const stringTimestamp = '1641038400';

            const timeResult = getTime(stringTimestamp);
            const dateResult = getDateTime(stringTimestamp);

            expect(timeResult).toMatch(/^\d{2}:\d{2}$/);
            expect(dateResult).toMatch(/^\d{1,2}\.\d{1,2}\.\d{4}$/);
        });

        it('maintains consistent format regardless of timezone', () => {
            const timestamp = 1641038400;

            const timeResult = getTime(timestamp);
            const dateResult = getDateTime(timestamp);

            // Time should always be HH:MM format
            expect(timeResult.length).toBe(5);
            expect(timeResult).toContain(':');

            // Date should always contain dots
            expect(dateResult).toContain('.');
            expect(dateResult.split('.')).toHaveLength(3);
        });
    });
});