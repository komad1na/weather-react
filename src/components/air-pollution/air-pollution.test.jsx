import React from "react";
import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";

// Mock the CSS import
vi.mock("./air-pollution-style.css", () => ({}));

// Mock the utility functions
vi.mock("../utils/getColor", () => ({
    no2: vi.fn(),
    pm10: vi.fn(),
    o3: vi.fn(),
    pm25: vi.fn()
}));

// Mock useSelector hook directly
vi.mock("react-redux/es/hooks/useSelector", () => ({
    useSelector: vi.fn()
}));

import AirPollution from "./air-pollution.jsx";
import { useSelector } from "react-redux/es/hooks/useSelector";
import { no2, pm10, o3, pm25 } from "../utils/getColor";

// Create mock store
const createMockStore = (airPollutionData) => {
    return configureStore({
        reducer: {
            data: (state = { airPollution: airPollutionData }, action) => state
        }
    });
};

describe("AirPollution Component", () => {
    beforeEach(() => {
        // Reset mocks before each test
        vi.clearAllMocks();

        // Set up default mock implementations
        no2.mockReturnValue({ color: "#79bc6a", text: "Very low" });
        pm10.mockReturnValue({ color: "#bbcf4c", text: "Low" });
        o3.mockReturnValue({ color: "#eec20b", text: "Medium" });
        pm25.mockReturnValue({ color: "#f29305", text: "High" });
    });

    const mockAirData = {
        no2: 30,
        pm10: 35,
        o3: 100,
        pm2_5: 25
    };

    it("renders air pollution title", () => {
        useSelector.mockReturnValue(mockAirData);

        render(<AirPollution />);

        expect(screen.getByText("Air Pollution")).toBeInTheDocument();
    });

    it("renders all pollutant headers", () => {
        useSelector.mockReturnValue(mockAirData);

        render(<AirPollution />);

        expect(screen.getByText("NO2")).toBeInTheDocument();
        expect(screen.getByText("PM10")).toBeInTheDocument();
        expect(screen.getByText("O3")).toBeInTheDocument();
        expect(screen.getByText("PM2.5")).toBeInTheDocument();
    });

    it("renders units for all pollutants", () => {
        useSelector.mockReturnValue(mockAirData);

        render(<AirPollution />);

        const units = screen.getAllByText("μg/m3");
        expect(units).toHaveLength(4);
    });

    it("calls color functions with correct data values", () => {
        useSelector.mockReturnValue(mockAirData);

        render(<AirPollution />);

        expect(no2).toHaveBeenCalledWith(30);
        expect(pm10).toHaveBeenCalledWith(35);
        expect(o3).toHaveBeenCalledWith(100);
        expect(pm25).toHaveBeenCalledWith(25);
    });

    it("renders pollutant values correctly", () => {
        useSelector.mockReturnValue(mockAirData);

        render(<AirPollution />);

        expect(screen.getByText("30")).toBeInTheDocument();
        expect(screen.getByText("35")).toBeInTheDocument();
        expect(screen.getByText("100")).toBeInTheDocument();
        expect(screen.getByText("25")).toBeInTheDocument();
    });

    it("renders air quality link", () => {
        useSelector.mockReturnValue(mockAirData);

        render(<AirPollution />);

        const link = screen.getByRole("link", {
            name: /read more about air quality index/i
        });
        expect(link).toBeInTheDocument();
        expect(link).toHaveAttribute(
            "href",
            "https://en.wikipedia.org/wiki/Air_quality_index#CAQI"
        );
    });

    it("handles missing air pollution data gracefully", () => {
        useSelector.mockReturnValue({});

        // Mock functions to handle undefined values
        no2.mockReturnValue({ color: "", text: "---" });
        pm10.mockReturnValue({ color: "", text: "---" });
        o3.mockReturnValue({ color: "", text: "---" });
        pm25.mockReturnValue({ color: "", text: "---" });

        render(<AirPollution />);

        expect(no2).toHaveBeenCalledWith(undefined);
        expect(pm10).toHaveBeenCalledWith(undefined);
        expect(o3).toHaveBeenCalledWith(undefined);
        expect(pm25).toHaveBeenCalledWith(undefined);
    });

    it("renders correct CSS class for main container", () => {
        useSelector.mockReturnValue(mockAirData);

        const { container } = render(<AirPollution />);

        const airCard = container.querySelector(".air-card");
        expect(airCard).toBeInTheDocument();
    });

    it("renders correct CSS class for title", () => {
        useSelector.mockReturnValue(mockAirData);

        const { container } = render(<AirPollution />);

        const title = container.querySelector(".title");
        expect(title).toBeInTheDocument();
        expect(title).toHaveTextContent("Air Pollution");
    });

    it("renders correct CSS class for link", () => {
        useSelector.mockReturnValue(mockAirData);

        const { container } = render(<AirPollution />);

        const link = container.querySelector(".link");
        expect(link).toBeInTheDocument();
    });

    it("renders pollutants grid structure", () => {
        useSelector.mockReturnValue(mockAirData);

        const { container } = render(<AirPollution />);

        const pollutantsGrid = container.querySelector(".pollutants-grid");
        expect(pollutantsGrid).toBeInTheDocument();

        const pollutantItems = container.querySelectorAll(".pollutant-item");
        expect(pollutantItems).toHaveLength(4);
    });
});
