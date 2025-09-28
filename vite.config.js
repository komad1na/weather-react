// vite.config.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
    plugins: [react()],
    base: "/weather/",
    test: {
        globals: true,
        environment: "jsdom",
        setupFiles: "./src/setupTests.js",
        css: true,
        coverage: {
            provider: "istanbul",
            reporter: ["text", "lcov", "html"], // lcov useful for GitHub integrations
            thresholds: {
                statements: 85,
                branches: 85,
                functions: 85,
                lines: 85
            }
        }
    }
});
