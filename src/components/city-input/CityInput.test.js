const React = require('react');
const { render, fireEvent } = require('@testing-library/react');
const { Provider } = require('react-redux');
const { configureStore } = require('@reduxjs/toolkit');

// Mock react-toastify
jest.mock('react-toastify', () => ({
  toast: {
    error: jest.fn()
  }
}));

// Mock redux slice
jest.mock('../../redux/dataSlice/dataSlice.js', () => ({
  getAPIData: jest.fn()
}));

const CityInput = require('./CityInput');

// Create a mock store
const mockStore = configureStore({
  reducer: {
    data: (state = {}, action) => state
  }
});

describe('CityInput Component', () => {
  it('should update input value on change', () => {
    const { getByPlaceholderText } = render(
      React.createElement(Provider, { store: mockStore },
        React.createElement(CityInput)
      )
    );
    const input = getByPlaceholderText('City name*');
    fireEvent.change(input, { target: { value: 'London' } });
    expect(input.value).toBe('London');
  });
});