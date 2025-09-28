import { no2, pm10, o3, pm25 } from './getColor';

describe('getColor Air Quality Index Functions', () => {
    describe('no2 function', () => {
        it('returns N/A for invalid values', () => {
            expect(no2(-1)).toEqual({ color: "#6c757d", text: "N/A" });
            expect(no2(null)).toEqual({ color: "#6c757d", text: "N/A" });
            expect(no2(undefined)).toEqual({ color: "#6c757d", text: "N/A" });
        });

        it('returns --- for zero value', () => {
            expect(no2(0)).toEqual({ color: "", text: "---" });
        });

        it('returns Very low for values 0-49', () => {
            expect(no2(1)).toEqual({ color: "#79bc6a", text: "Very low" });
            expect(no2(25)).toEqual({ color: "#79bc6a", text: "Very low" });
            expect(no2(49)).toEqual({ color: "#79bc6a", text: "Very low" });
        });

        it('returns Low for values 50-99', () => {
            expect(no2(50)).toEqual({ color: "#bbcf4c", text: "Low" });
            expect(no2(75)).toEqual({ color: "#bbcf4c", text: "Low" });
            expect(no2(99)).toEqual({ color: "#bbcf4c", text: "Low" });
        });

        it('returns Medium for values 100-199', () => {
            expect(no2(100)).toEqual({ color: "#eec20b", text: "Medium" });
            expect(no2(150)).toEqual({ color: "#eec20b", text: "Medium" });
            expect(no2(199)).toEqual({ color: "#eec20b", text: "Medium" });
        });

        it('returns High for values 200-399', () => {
            expect(no2(200)).toEqual({ color: "#f29305", text: "High" });
            expect(no2(300)).toEqual({ color: "#f29305", text: "High" });
            expect(no2(399)).toEqual({ color: "#f29305", text: "High" });
        });

        it('returns Very high for values 400+', () => {
            expect(no2(400)).toEqual({ color: "#e8416f", text: "Very high" });
            expect(no2(500)).toEqual({ color: "#e8416f", text: "Very high" });
            expect(no2(1000)).toEqual({ color: "#e8416f", text: "Very high" });
        });

        it('handles decimal values correctly', () => {
            expect(no2(49.9)).toEqual({ color: "#79bc6a", text: "Very low" });
            expect(no2(50.1)).toEqual({ color: "#bbcf4c", text: "Low" });
        });
    });

    describe('pm10 function', () => {
        it('returns N/A for invalid values', () => {
            expect(pm10(-1)).toEqual({ color: "#6c757d", text: "N/A" });
            expect(pm10(null)).toEqual({ color: "#6c757d", text: "N/A" });
            expect(pm10(undefined)).toEqual({ color: "#6c757d", text: "N/A" });
        });

        it('returns --- for zero value', () => {
            expect(pm10(0)).toEqual({ color: "", text: "---" });
        });

        it('returns Very low for values 0-24', () => {
            expect(pm10(0)).toEqual({ color: "", text: "---" }); // Special case for 0
            expect(pm10(1)).toEqual({ color: "#79bc6a", text: "Very low" });
            expect(pm10(24)).toEqual({ color: "#79bc6a", text: "Very low" });
        });

        it('returns Low for values 25-49', () => {
            expect(pm10(25)).toEqual({ color: "#bbcf4c", text: "Low" });
            expect(pm10(37)).toEqual({ color: "#bbcf4c", text: "Low" });
            expect(pm10(49)).toEqual({ color: "#bbcf4c", text: "Low" });
        });

        it('returns Medium for values 50-89', () => {
            expect(pm10(50)).toEqual({ color: "#eec20b", text: "Medium" });
            expect(pm10(70)).toEqual({ color: "#eec20b", text: "Medium" });
            expect(pm10(89)).toEqual({ color: "#eec20b", text: "Medium" });
        });

        it('returns High for values 90-179', () => {
            expect(pm10(90)).toEqual({ color: "#f29305", text: "High" });
            expect(pm10(135)).toEqual({ color: "#f29305", text: "High" });
            expect(pm10(179)).toEqual({ color: "#f29305", text: "High" });
        });

        it('returns Very high for values 180+', () => {
            expect(pm10(180)).toEqual({ color: "#e8416f", text: "Very high" });
            expect(pm10(250)).toEqual({ color: "#e8416f", text: "Very high" });
            expect(pm10(500)).toEqual({ color: "#e8416f", text: "Very high" });
        });
    });

    describe('o3 function', () => {
        it('returns N/A for invalid values', () => {
            expect(o3(-1)).toEqual({ color: "#6c757d", text: "N/A" });
            expect(o3(null)).toEqual({ color: "#6c757d", text: "N/A" });
            expect(o3(undefined)).toEqual({ color: "#6c757d", text: "N/A" });
        });

        it('returns --- for zero value', () => {
            expect(o3(0)).toEqual({ color: "", text: "---" });
        });

        it('returns Very low for values 0-59', () => {
            expect(o3(1)).toEqual({ color: "#79bc6a", text: "Very low" });
            expect(o3(30)).toEqual({ color: "#79bc6a", text: "Very low" });
            expect(o3(59)).toEqual({ color: "#79bc6a", text: "Very low" });
        });

        it('returns Low for values 60-119', () => {
            expect(o3(60)).toEqual({ color: "#bbcf4c", text: "Low" });
            expect(o3(90)).toEqual({ color: "#bbcf4c", text: "Low" });
            expect(o3(119)).toEqual({ color: "#bbcf4c", text: "Low" });
        });

        it('returns Medium for values 120-179', () => {
            expect(o3(120)).toEqual({ color: "#eec20b", text: "Medium" });
            expect(o3(150)).toEqual({ color: "#eec20b", text: "Medium" });
            expect(o3(179)).toEqual({ color: "#eec20b", text: "Medium" });
        });

        it('returns High for values 180-239', () => {
            expect(o3(180)).toEqual({ color: "#f29305", text: "High" });
            expect(o3(210)).toEqual({ color: "#f29305", text: "High" });
            expect(o3(239)).toEqual({ color: "#f29305", text: "High" });
        });

        it('returns Very high for values 240+', () => {
            expect(o3(240)).toEqual({ color: "#e8416f", text: "Very high" });
            expect(o3(300)).toEqual({ color: "#e8416f", text: "Very high" });
            expect(o3(500)).toEqual({ color: "#e8416f", text: "Very high" });
        });
    });

    describe('pm25 function', () => {
        it('returns N/A for invalid values', () => {
            expect(pm25(-1)).toEqual({ color: "#6c757d", text: "N/A" });
            expect(pm25(null)).toEqual({ color: "#6c757d", text: "N/A" });
            expect(pm25(undefined)).toEqual({ color: "#6c757d", text: "N/A" });
        });

        it('returns --- for zero value', () => {
            expect(pm25(0)).toEqual({ color: "", text: "---" });
        });

        it('returns Very low for values 0-14', () => {
            expect(pm25(1)).toEqual({ color: "#79bc6a", text: "Very low" });
            expect(pm25(7)).toEqual({ color: "#79bc6a", text: "Very low" });
            expect(pm25(14)).toEqual({ color: "#79bc6a", text: "Very low" });
        });

        it('returns Low for values 15-29', () => {
            expect(pm25(15)).toEqual({ color: "#bbcf4c", text: "Low" });
            expect(pm25(22)).toEqual({ color: "#bbcf4c", text: "Low" });
            expect(pm25(29)).toEqual({ color: "#bbcf4c", text: "Low" });
        });

        it('returns Medium for values 30-54', () => {
            expect(pm25(30)).toEqual({ color: "#eec20b", text: "Medium" });
            expect(pm25(42)).toEqual({ color: "#eec20b", text: "Medium" });
            expect(pm25(54)).toEqual({ color: "#eec20b", text: "Medium" });
        });

        it('returns High for values 55-109', () => {
            expect(pm25(55)).toEqual({ color: "#f29305", text: "High" });
            expect(pm25(82)).toEqual({ color: "#f29305", text: "High" });
            expect(pm25(109)).toEqual({ color: "#f29305", text: "High" });
        });

        it('returns Very high for values 110+', () => {
            expect(pm25(110)).toEqual({ color: "#e8416f", text: "Very high" });
            expect(pm25(150)).toEqual({ color: "#e8416f", text: "Very high" });
            expect(pm25(300)).toEqual({ color: "#e8416f", text: "Very high" });
        });
    });

    describe('Boundary Testing', () => {
        it('handles exact boundary values correctly across all functions', () => {
            // Test critical boundary values for all functions
            const boundaryTests = [
                { func: no2, value: 49.99, expected: "Very low" },
                { func: no2, value: 50, expected: "Low" },
                { func: pm10, value: 24.99, expected: "Very low" },
                { func: pm10, value: 25, expected: "Low" },
                { func: o3, value: 59.99, expected: "Very low" },
                { func: o3, value: 60, expected: "Low" },
                { func: pm25, value: 14.99, expected: "Very low" },
                { func: pm25, value: 15, expected: "Low" }
            ];

            boundaryTests.forEach(({ func, value, expected }) => {
                expect(func(value).text).toBe(expected);
            });
        });
    });

    describe('Color Consistency', () => {
        it('returns consistent colors across all functions for same quality levels', () => {
            const veryLowColor = "#79bc6a";
            const lowColor = "#bbcf4c";
            const mediumColor = "#eec20b";
            const highColor = "#f29305";
            const veryHighColor = "#e8416f";
            const naColor = "#6c757d";

            expect(no2(25).color).toBe(veryLowColor);
            expect(pm10(15).color).toBe(veryLowColor);
            expect(o3(30).color).toBe(veryLowColor);
            expect(pm25(10).color).toBe(veryLowColor);

            expect(no2(75).color).toBe(lowColor);
            expect(pm10(35).color).toBe(lowColor);
            expect(o3(90).color).toBe(lowColor);
            expect(pm25(20).color).toBe(lowColor);

            expect(no2(null).color).toBe(naColor);
            expect(pm10(null).color).toBe(naColor);
            expect(o3(null).color).toBe(naColor);
            expect(pm25(null).color).toBe(naColor);
        });
    });

    describe('Edge Cases', () => {
        it('handles extremely large numbers', () => {
            expect(no2(999999)).toEqual({ color: "#e8416f", text: "Very high" });
            expect(pm10(999999)).toEqual({ color: "#e8416f", text: "Very high" });
            expect(o3(999999)).toEqual({ color: "#e8416f", text: "Very high" });
            expect(pm25(999999)).toEqual({ color: "#e8416f", text: "Very high" });
        });

        it('handles string inputs that can be interpreted as numbers', () => {
            // Note: These tests depend on JavaScript's type coercion behavior
            expect(no2("25")).toEqual({ color: "#79bc6a", text: "Very low" });
            expect(pm10("50")).toEqual({ color: "#eec20b", text: "Medium" });
        });

        it('handles NaN values', () => {
            expect(no2(NaN)).toEqual({ color: "#6c757d", text: "Unknown" });
            expect(pm10(NaN)).toEqual({ color: "#6c757d", text: "Unknown" });
            expect(o3(NaN)).toEqual({ color: "#6c757d", text: "Unknown" });
            expect(pm25(NaN)).toEqual({ color: "#6c757d", text: "Unknown" });
        });
    });

    describe('Real-world Scenarios', () => {
        it('handles typical air quality readings', () => {
            // Simulate realistic air quality data
            const realisticReadings = {
                cleanAir: { no2: 15, pm10: 12, o3: 45, pm25: 8 },
                moderateAir: { no2: 75, pm10: 35, o3: 95, pm25: 22 },
                pollutedAir: { no2: 150, pm10: 75, o3: 160, pm25: 45 }
            };

            // Clean air should mostly be Very low/Low
            expect(no2(realisticReadings.cleanAir.no2).text).toBe("Very low");
            expect(pm10(realisticReadings.cleanAir.pm10).text).toBe("Very low");
            expect(o3(realisticReadings.cleanAir.o3).text).toBe("Very low");
            expect(pm25(realisticReadings.cleanAir.pm25).text).toBe("Very low");

            // Moderate air should be Low/Medium
            expect(no2(realisticReadings.moderateAir.no2).text).toBe("Low");
            expect(pm10(realisticReadings.moderateAir.pm10).text).toBe("Low");
            expect(o3(realisticReadings.moderateAir.o3).text).toBe("Low");
            expect(pm25(realisticReadings.moderateAir.pm25).text).toBe("Low");

            // Polluted air should be Medium/High
            expect(no2(realisticReadings.pollutedAir.no2).text).toBe("Medium");
            expect(pm10(realisticReadings.pollutedAir.pm10).text).toBe("Medium");
            expect(o3(realisticReadings.pollutedAir.o3).text).toBe("Medium");
            expect(pm25(realisticReadings.pollutedAir.pm25).text).toBe("Medium");
        });
    });
});