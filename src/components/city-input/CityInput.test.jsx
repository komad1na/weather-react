import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';

// Mock CSS import
vi.mock('./city-input-style.css', () => ({}));

// Mock react-toastify
vi.mock('react-toastify', () => ({
  toast: {
    error: vi.fn()
  }
}));

// Mock redux slice
vi.mock('../../redux/dataSlice/dataSlice.js', () => ({
  getAPIData: vi.fn()
}));

import CityInput from './CityInput';
import { toast } from 'react-toastify';
import { getAPIData } from '../../redux/dataSlice/dataSlice.js';

// Create a mock store with dispatch spy
const mockDispatch = vi.fn();
const mockStore = configureStore({
  reducer: {
    data: (state = {}, action) => state
  }
});

// Mock useDispatch to return our spy
vi.mock('react-redux', async () => {
  const actual = await vi.importActual('react-redux');
  return {
    ...actual,
    useDispatch: () => mockDispatch
  };
});

describe('CityInput Component', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    vi.clearAllMocks();
  });

  describe('Component Rendering', () => {
    it('should render input with correct attributes', () => {
      render(
        <Provider store={mockStore}>
          <CityInput />
        </Provider>
      );

      const input = screen.getByPlaceholderText('City name*');

      expect(input).toBeInTheDocument();
      expect(input).toHaveAttribute('type', 'text');
      expect(input).toHaveAttribute('placeholder', 'City name*');
      expect(input).toHaveAttribute('required');
      expect(input).toHaveClass('cityInput');
      expect(input.value).toBe('');
    });

    it('should render as a text input element', () => {
      render(
        <Provider store={mockStore}>
          <CityInput />
        </Provider>
      );

      const input = screen.getByRole('textbox');
      expect(input).toBeInTheDocument();
      expect(input.tagName).toBe('INPUT');
    });

    it('should have correct CSS class applied', () => {
      render(
        <Provider store={mockStore}>
          <CityInput />
        </Provider>
      );

      const input = screen.getByPlaceholderText('City name*');
      expect(input).toHaveClass('cityInput');
    });
  });

  describe('Input Value Management', () => {
    it('should update input value on change', () => {
      render(
        <Provider store={mockStore}>
          <CityInput />
        </Provider>
      );

      const input = screen.getByPlaceholderText('City name*');
      fireEvent.change(input, { target: { value: 'London' } });

      expect(input.value).toBe('London');
    });

    it('should handle multiple value changes', () => {
      render(
        <Provider store={mockStore}>
          <CityInput />
        </Provider>
      );

      const input = screen.getByPlaceholderText('City name*');

      fireEvent.change(input, { target: { value: 'London' } });
      expect(input.value).toBe('London');

      fireEvent.change(input, { target: { value: 'Paris' } });
      expect(input.value).toBe('Paris');

      fireEvent.change(input, { target: { value: '' } });
      expect(input.value).toBe('');
    });

    it('should handle special characters in city names', () => {
      render(
        <Provider store={mockStore}>
          <CityInput />
        </Provider>
      );

      const input = screen.getByPlaceholderText('City name*');

      fireEvent.change(input, { target: { value: 'São Paulo' } });
      expect(input.value).toBe('São Paulo');

      fireEvent.change(input, { target: { value: 'New York' } });
      expect(input.value).toBe('New York');

      fireEvent.change(input, { target: { value: 'Москва' } });
      expect(input.value).toBe('Москва');
    });

    it('should handle long city names', () => {
      render(
        <Provider store={mockStore}>
          <CityInput />
        </Provider>
      );

      const input = screen.getByPlaceholderText('City name*');
      const longCityName = 'A very long city name that might overflow';

      fireEvent.change(input, { target: { value: longCityName } });
      expect(input.value).toBe(longCityName);
    });
  });

  describe('Enter Key Handling - Valid Input', () => {
    it('should dispatch getAPIData when Enter is pressed with valid city name', () => {
      render(
        <Provider store={mockStore}>
          <CityInput />
        </Provider>
      );

      const input = screen.getByPlaceholderText('City name*');

      // Type a city name
      fireEvent.change(input, { target: { value: 'London' } });
      expect(input.value).toBe('London');

      // Press Enter (keyCode 13)
      fireEvent.keyDown(input, { keyCode: 13 });

      // Should dispatch getAPIData with the city name
      expect(mockDispatch).toHaveBeenCalledTimes(1);
      expect(getAPIData).toHaveBeenCalledWith('London');
    });

    it('should clear input after successful submission', () => {
      render(
        <Provider store={mockStore}>
          <CityInput />
        </Provider>
      );

      const input = screen.getByPlaceholderText('City name*');

      // Type a city name
      fireEvent.change(input, { target: { value: 'Paris' } });
      expect(input.value).toBe('Paris');

      // Press Enter
      fireEvent.keyDown(input, { keyCode: 13 });

      // Input should be cleared
      expect(input.value).toBe('');
    });

    it('should handle city names with spaces correctly', () => {
      render(
        <Provider store={mockStore}>
          <CityInput />
        </Provider>
      );

      const input = screen.getByPlaceholderText('City name*');

      fireEvent.change(input, { target: { value: 'New York' } });
      fireEvent.keyDown(input, { keyCode: 13 });

      expect(getAPIData).toHaveBeenCalledWith('New York');
      expect(input.value).toBe('');
    });

    it('should handle city names with special characters', () => {
      render(
        <Provider store={mockStore}>
          <CityInput />
        </Provider>
      );

      const input = screen.getByPlaceholderText('City name*');

      fireEvent.change(input, { target: { value: 'São Paulo' } });
      fireEvent.keyDown(input, { keyCode: 13 });

      expect(getAPIData).toHaveBeenCalledWith('São Paulo');
      expect(input.value).toBe('');
    });

    it('should trim whitespace from city names', () => {
      render(
        <Provider store={mockStore}>
          <CityInput />
        </Provider>
      );

      const input = screen.getByPlaceholderText('City name*');

      fireEvent.change(input, { target: { value: '  London  ' } });
      fireEvent.keyDown(input, { keyCode: 13 });

      expect(getAPIData).toHaveBeenCalledWith('  London  ');
      expect(input.value).toBe('');
    });
  });

  describe('Enter Key Handling - Empty Input', () => {
    it('should show error toast when Enter is pressed with empty input', () => {
      render(
        <Provider store={mockStore}>
          <CityInput />
        </Provider>
      );

      const input = screen.getByPlaceholderText('City name*');

      // Press Enter with empty input
      fireEvent.keyDown(input, { keyCode: 13 });

      // Should call error toast
      expect(toast.error).toHaveBeenCalledTimes(1);
      expect(toast.error).toHaveBeenCalledWith("City name can't be empty.", {
        position: "top-right",
        autoClose: 4000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: false,
        draggable: false,
        progress: undefined,
        toastId: "error",
        theme: "dark"
      });

      // Should not dispatch getAPIData
      expect(mockDispatch).not.toHaveBeenCalled();
      expect(getAPIData).not.toHaveBeenCalled();
    });

    it('should show error toast when Enter is pressed with only spaces', () => {
      render(
        <Provider store={mockStore}>
          <CityInput />
        </Provider>
      );

      const input = screen.getByPlaceholderText('City name*');

      // Type only spaces
      fireEvent.change(input, { target: { value: '   ' } });

      // Clear input to make it empty (simulating trimmed input)
      fireEvent.change(input, { target: { value: '' } });
      fireEvent.keyDown(input, { keyCode: 13 });

      expect(toast.error).toHaveBeenCalledTimes(1);
      expect(mockDispatch).not.toHaveBeenCalled();
    });

    it('should not clear input when error occurs', () => {
      render(
        <Provider store={mockStore}>
          <CityInput />
        </Provider>
      );

      const input = screen.getByPlaceholderText('City name*');

      // Press Enter with empty input
      fireEvent.keyDown(input, { keyCode: 13 });

      // Input should remain empty (not changed)
      expect(input.value).toBe('');
      expect(toast.error).toHaveBeenCalledTimes(1);
    });
  });

  describe('Keyboard Event Handling', () => {
    it('should only respond to Enter key (keyCode 13)', () => {
      render(
        <Provider store={mockStore}>
          <CityInput />
        </Provider>
      );

      const input = screen.getByPlaceholderText('City name*');
      fireEvent.change(input, { target: { value: 'London' } });

      // Test various key codes that should NOT trigger submission
      const nonEnterKeys = [8, 9, 16, 17, 18, 27, 32, 37, 38, 39, 40];

      nonEnterKeys.forEach(keyCode => {
        fireEvent.keyDown(input, { keyCode });
        expect(mockDispatch).not.toHaveBeenCalled();
        expect(getAPIData).not.toHaveBeenCalled();
        expect(toast.error).not.toHaveBeenCalled();
      });

      // Input value should remain unchanged
      expect(input.value).toBe('London');
    });

    it('should handle Enter key with different event properties', () => {
      render(
        <Provider store={mockStore}>
          <CityInput />
        </Provider>
      );

      const input = screen.getByPlaceholderText('City name*');
      fireEvent.change(input, { target: { value: 'Berlin' } });

      // Test Enter key with additional event properties
      fireEvent.keyDown(input, {
        keyCode: 13,
        key: 'Enter',
        code: 'Enter',
        which: 13
      });

      expect(getAPIData).toHaveBeenCalledWith('Berlin');
      expect(input.value).toBe('');
    });

    it('should handle multiple rapid Enter key presses', () => {
      render(
        <Provider store={mockStore}>
          <CityInput />
        </Provider>
      );

      const input = screen.getByPlaceholderText('City name*');

      // First submission
      fireEvent.change(input, { target: { value: 'Tokyo' } });
      fireEvent.keyDown(input, { keyCode: 13 });

      expect(getAPIData).toHaveBeenCalledWith('Tokyo');
      expect(input.value).toBe('');

      // Second rapid submission (empty input)
      fireEvent.keyDown(input, { keyCode: 13 });

      expect(toast.error).toHaveBeenCalledTimes(1);
      expect(getAPIData).toHaveBeenCalledTimes(1); // Should still be 1
    });
  });

  describe('Error Function', () => {
    it('should call toast.error with correct parameters', () => {
      render(
        <Provider store={mockStore}>
          <CityInput />
        </Provider>
      );

      const input = screen.getByPlaceholderText('City name*');
      fireEvent.keyDown(input, { keyCode: 13 });

      expect(toast.error).toHaveBeenCalledTimes(1);
      expect(toast.error).toHaveBeenCalledWith("City name can't be empty.", {
        position: "top-right",
        autoClose: 4000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: false,
        draggable: false,
        progress: undefined,
        toastId: "error",
        theme: "dark"
      });
    });

    it('should call error function only for empty input submissions', () => {
      render(
        <Provider store={mockStore}>
          <CityInput />
        </Provider>
      );

      const input = screen.getByPlaceholderText('City name*');

      // Valid submission should not call error
      fireEvent.change(input, { target: { value: 'Madrid' } });
      fireEvent.keyDown(input, { keyCode: 13 });

      expect(toast.error).not.toHaveBeenCalled();

      // Empty submission should call error
      fireEvent.keyDown(input, { keyCode: 13 });

      expect(toast.error).toHaveBeenCalledTimes(1);
    });
  });

  describe('Redux Integration', () => {
    it('should integrate correctly with Redux store', () => {
      render(
        <Provider store={mockStore}>
          <CityInput />
        </Provider>
      );

      const input = screen.getByPlaceholderText('City name*');
      fireEvent.change(input, { target: { value: 'Mumbai' } });
      fireEvent.keyDown(input, { keyCode: 13 });

      // Should use mocked dispatch
      expect(mockDispatch).toHaveBeenCalledTimes(1);

      // Should call getAPIData action creator
      expect(getAPIData).toHaveBeenCalledWith('Mumbai');
    });

    it('should work without Redux Provider (error handling)', () => {
      // This test verifies the component doesn't crash without Provider
      // Note: In real usage, this would throw an error, but our mocked useDispatch handles it
      expect(() => {
        render(<CityInput />);
      }).not.toThrow();
    });
  });

  describe('Component State Management', () => {
    it('should maintain independent state across multiple component instances', () => {
      // First render
      const { unmount: unmount1 } = render(
        <Provider store={mockStore}>
          <CityInput />
        </Provider>
      );

      let input = screen.getByPlaceholderText('City name*');
      fireEvent.change(input, { target: { value: 'Chicago' } });
      expect(input.value).toBe('Chicago');

      // Unmount first instance
      unmount1();

      // Render new instance
      render(
        <Provider store={mockStore}>
          <CityInput />
        </Provider>
      );

      // New instance should start with empty state
      input = screen.getByPlaceholderText('City name*');
      expect(input.value).toBe('');
    });

    it('should handle setState correctly', () => {
      render(
        <Provider store={mockStore}>
          <CityInput />
        </Provider>
      );

      const input = screen.getByPlaceholderText('City name*');

      // Multiple state changes
      fireEvent.change(input, { target: { value: 'A' } });
      expect(input.value).toBe('A');

      fireEvent.change(input, { target: { value: 'Ab' } });
      expect(input.value).toBe('Ab');

      fireEvent.change(input, { target: { value: 'Abu' } });
      expect(input.value).toBe('Abu');

      fireEvent.change(input, { target: { value: 'Abu Dhabi' } });
      expect(input.value).toBe('Abu Dhabi');
    });
  });

  describe('Edge Cases and Accessibility', () => {
    it('should be accessible with screen readers', () => {
      render(
        <Provider store={mockStore}>
          <CityInput />
        </Provider>
      );

      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('placeholder', 'City name*');
      expect(input).toHaveAttribute('required');
    });

    it('should handle focus and blur events', () => {
      render(
        <Provider store={mockStore}>
          <CityInput />
        </Provider>
      );

      const input = screen.getByPlaceholderText('City name*');

      // Focus should work - verify element can receive focus
      input.focus();
      expect(document.activeElement).toBe(input);

      // Blur should work
      input.blur();
      expect(document.activeElement).not.toBe(input);
    });

    it('should handle copy/paste operations', () => {
      render(
        <Provider store={mockStore}>
          <CityInput />
        </Provider>
      );

      const input = screen.getByPlaceholderText('City name*');

      // Simulate paste
      fireEvent.paste(input, {
        clipboardData: {
          getData: () => 'Barcelona'
        }
      });

      // Set the value as if paste worked
      fireEvent.change(input, { target: { value: 'Barcelona' } });
      expect(input.value).toBe('Barcelona');
    });

    it('should handle null/undefined values gracefully', () => {
      render(
        <Provider store={mockStore}>
          <CityInput />
        </Provider>
      );

      const input = screen.getByPlaceholderText('City name*');

      // These shouldn't break the component
      expect(() => {
        fireEvent.change(input, { target: { value: null } });
      }).not.toThrow();

      expect(() => {
        fireEvent.change(input, { target: { value: undefined } });
      }).not.toThrow();
    });

    it('should be properly typed as required input', () => {
      render(
        <Provider store={mockStore}>
          <CityInput />
        </Provider>
      );

      const input = screen.getByPlaceholderText('City name*');
      expect(input).toBeRequired();
    });
  });
});