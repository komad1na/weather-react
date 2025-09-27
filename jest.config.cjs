module.exports = {
  testEnvironment: "jsdom",
  transform: {
    "^.+\\.jsx?$": "babel-jest"
  },
  moduleNameMapper: {
    "\\.(css|less|scss|sass)$": "identity-obj-proxy"
  },
  transformIgnorePatterns: [
    "node_modules/(?!(react-redux|@reduxjs/toolkit)/)"
  ],
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.js']
};