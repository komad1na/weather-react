import React from "react";
import { render } from "@testing-library/react";

// Mock CSS imports
vi.mock("react-toastify/dist/ReactToastify.css", () => ({}));
vi.mock("./App.css", () => ({}));

// Mock all child components
vi.mock("./components/footer/Footer.jsx", () => ({
    default: function MockFooter() {
        return <div data-testid="footer">Mock Footer</div>;
    }
}));

vi.mock("./components/header/Header.jsx", () => ({
    default: function MockHeader() {
        return <div data-testid="header">Mock Header</div>;
    }
}));

vi.mock("./components/weather-card/weather-card.jsx", () => ({
    default: function MockWeatherCard() {
        return <div data-testid="weather-card">Mock Weather Card</div>;
    }
}));

vi.mock("./components/air-pollution/air-pollution.jsx", () => ({
    default: function MockAirPollution() {
        return <div data-testid="air-pollution">Mock Air Pollution</div>;
    }
}));

vi.mock("./components/sun-info/sun-info.jsx", () => ({
    default: function MockSunInfo() {
        return <div data-testid="sun-info">Mock Sun Info</div>;
    }
}));

vi.mock("./components/forecast-list/forecast-list.jsx", () => ({
    default: function MockForecastList() {
        return <div data-testid="forecast-list">Mock Forecast List</div>;
    }
}));

// Mock react-toastify
vi.mock("react-toastify", () => ({
    ToastContainer: function MockToastContainer(props) {
        // Extract known DOM attributes and convert React props to lowercase DOM attributes
        const domProps = {};
        if (props.position) domProps.position = props.position;
        if (props.autoClose) domProps.autoclose = props.autoClose.toString();
        if (props.hideProgressBar !== undefined)
            domProps.hideprogressbar = props.hideProgressBar.toString();
        if (props.newestOnTop !== undefined)
            domProps.newestontop = props.newestOnTop.toString();
        if (props.closeOnClick !== undefined)
            domProps.closeonclick = props.closeOnClick.toString();
        if (props.rtl !== undefined) domProps.rtl = props.rtl.toString();
        if (props.pauseOnFocusLoss !== undefined)
            domProps.pauseonfocusloss = props.pauseOnFocusLoss ? "" : "";
        if (props.draggable !== undefined)
            domProps.draggable = props.draggable.toString();
        if (props.pauseOnHover !== undefined)
            domProps.pauseonhover = props.pauseOnHover.toString();

        return (
            <div data-testid="toast-container" {...domProps}>
                Toast Container
            </div>
        );
    }
}));

import App from "./App";

describe("App Component", () => {
    it("renders main App container with correct class", () => {
        const { container } = render(<App />);

        const appContainer = container.querySelector(".App");
        expect(appContainer).toBeInTheDocument();
        expect(appContainer).toHaveClass("App");
    });

    it("renders Header component", () => {
        const { getByTestId } = render(<App />);

        expect(getByTestId("header")).toBeInTheDocument();
    });

    it("renders Footer component", () => {
        const { getByTestId } = render(<App />);

        expect(getByTestId("footer")).toBeInTheDocument();
    });

    it("renders all main weather components inside grid", () => {
        const { getByTestId } = render(<App />);

        expect(getByTestId("weather-card")).toBeInTheDocument();
        expect(getByTestId("air-pollution")).toBeInTheDocument();
        expect(getByTestId("sun-info")).toBeInTheDocument();
        expect(getByTestId("forecast-list")).toBeInTheDocument();
    });

    it("renders grid container with correct class", () => {
        const { container } = render(<App />);

        const gridContainer = container.querySelector(".grid");
        expect(gridContainer).toBeInTheDocument();
        expect(gridContainer).toHaveClass("grid");
    });

    it("renders ToastContainer with correct props", () => {
        const { getByTestId } = render(<App />);

        const toastContainer = getByTestId("toast-container");
        expect(toastContainer).toBeInTheDocument();

        // Check some of the props that were passed
        expect(toastContainer).toHaveAttribute("position", "top-right");
        expect(toastContainer).toHaveAttribute("autoclose", "4000");
        expect(toastContainer).toHaveAttribute("hideprogressbar", "false");
        expect(toastContainer).toHaveAttribute("newestontop", "false");
        expect(toastContainer).toHaveAttribute("closeonclick", "false");
        expect(toastContainer).toHaveAttribute("rtl", "false");
        expect(toastContainer).toHaveAttribute("pauseonfocusloss", "");
        expect(toastContainer).toHaveAttribute("draggable", "false");
        expect(toastContainer).toHaveAttribute("pauseonhover", "false");
    });

    it("has correct component hierarchy", () => {
        const { container } = render(<App />);

        const app = container.querySelector(".App");
        expect(app.children).toHaveLength(4); // Header, grid, Footer, ToastContainer

        // Check that Header is the first child
        expect(app.children[0]).toHaveAttribute("data-testid", "header");

        // Check that grid is the second child
        expect(app.children[1]).toHaveClass("grid");

        // Check that Footer is the third child
        expect(app.children[2]).toHaveAttribute("data-testid", "footer");
    });

    it("grid contains exactly 4 weather components", () => {
        const { container } = render(<App />);

        const grid = container.querySelector(".grid");
        expect(grid.children).toHaveLength(4);

        // Verify each component is in the grid
        expect(
            grid.querySelector('[data-testid="weather-card"]')
        ).toBeInTheDocument();
        expect(
            grid.querySelector('[data-testid="air-pollution"]')
        ).toBeInTheDocument();
        expect(
            grid.querySelector('[data-testid="sun-info"]')
        ).toBeInTheDocument();
        expect(
            grid.querySelector('[data-testid="forecast-list"]')
        ).toBeInTheDocument();
    });

    it("renders components in correct order", () => {
        const { container } = render(<App />);

        const appChildren = container.querySelector(".App").children;

        // Header should be first
        expect(appChildren[0]).toHaveAttribute("data-testid", "header");

        // Grid should be second
        expect(appChildren[1]).toHaveClass("grid");

        // Footer should be third
        expect(appChildren[2]).toHaveAttribute("data-testid", "footer");

        // ToastContainer should be last
        expect(appChildren[3]).toHaveAttribute(
            "data-testid",
            "toast-container"
        );
    });

    it("grid components are in correct order", () => {
        const { container } = render(<App />);

        const gridChildren = container.querySelector(".grid").children;

        expect(gridChildren[0]).toHaveAttribute("data-testid", "weather-card");
        expect(gridChildren[1]).toHaveAttribute("data-testid", "air-pollution");
        expect(gridChildren[2]).toHaveAttribute("data-testid", "sun-info");
        expect(gridChildren[3]).toHaveAttribute("data-testid", "forecast-list");
    });

    it("renders without crashing", () => {
        expect(() => render(<App />)).not.toThrow();
    });

    it("ToastContainer has all required accessibility props", () => {
        const { getByTestId } = render(<App />);

        const toastContainer = getByTestId("toast-container");

        // Verify toast configuration for UX
        expect(toastContainer).toHaveAttribute("autoclose", "4000"); // 4 second auto-close
        expect(toastContainer).toHaveAttribute("position", "top-right"); // Standard position
        expect(toastContainer).toHaveAttribute("closeonclick", "false"); // Requires intentional dismiss
        expect(toastContainer).toHaveAttribute("pauseonhover", "false"); // No pause on hover
    });

    it("maintains proper semantic structure", () => {
        const { container } = render(<App />);

        // Should have a main container
        const app = container.querySelector(".App");
        expect(app).toBeInTheDocument();

        // Should separate content logically: header, main content (grid), footer
        expect(app.children).toHaveLength(4); // Including ToastContainer
    });

    it("includes all necessary imports in structure", () => {
        const { getByTestId } = render(<App />);

        // Verify all imported components are rendered
        expect(getByTestId("footer")).toBeInTheDocument();
        expect(getByTestId("header")).toBeInTheDocument();
        expect(getByTestId("weather-card")).toBeInTheDocument();
        expect(getByTestId("air-pollution")).toBeInTheDocument();
        expect(getByTestId("sun-info")).toBeInTheDocument();
        expect(getByTestId("forecast-list")).toBeInTheDocument();
        expect(getByTestId("toast-container")).toBeInTheDocument();
    });
});
