const React = require('react');
const { render, screen } = require('@testing-library/react');
const { Provider } = require('react-redux');
const { configureStore } = require('@reduxjs/toolkit');

// Mock the CSS import
jest.mock('./air-pollution-style.css', () => ({}));

// Mock the utility functions
jest.mock('../utils/getColor', () => ({
  no2: jest.fn(),
  pm10: jest.fn(),
  o3: jest.fn(),
  pm25: jest.fn()
}));

// Mock TableData component
jest.mock('../utils/tableData', () => {
  return function MockTableData({ color, text }) {
    const React = require('react');
    return React.createElement('td', {
      'data-testid': 'table-data',
      style: { backgroundColor: color }
    }, text);
  };
});

// Mock useSelector hook directly
jest.mock('react-redux/es/hooks/useSelector', () => ({
  useSelector: jest.fn()
}));

const AirPollution = require('./air-pollution.js').default;
const { useSelector } = require('react-redux/es/hooks/useSelector');
const { no2, pm10, o3, pm25 } = require('../utils/getColor');

// Create mock store
const createMockStore = (airPollutionData) => {
  return configureStore({
    reducer: {
      data: (state = { airPollution: airPollutionData }, action) => state
    }
  });
};

describe('AirPollution Component', () => {
  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();

    // Set up default mock implementations
    no2.mockReturnValue({ color: '#79bc6a', text: 'Very low' });
    pm10.mockReturnValue({ color: '#bbcf4c', text: 'Low' });
    o3.mockReturnValue({ color: '#eec20b', text: 'Medium' });
    pm25.mockReturnValue({ color: '#f29305', text: 'High' });
  });

  const mockAirData = {
    no2: 30,
    pm10: 35,
    o3: 100,
    pm2_5: 25
  };

  it('renders air pollution title', () => {
    useSelector.mockReturnValue(mockAirData);

    render(React.createElement(AirPollution));

    expect(screen.getByText('Air Pollution')).toBeInTheDocument();
  });

  it('renders all pollutant headers', () => {
    useSelector.mockReturnValue(mockAirData);

    render(React.createElement(AirPollution));

    expect(screen.getByText('NO2')).toBeInTheDocument();
    expect(screen.getByText('PM10')).toBeInTheDocument();
    expect(screen.getByText('O3')).toBeInTheDocument();
    expect(screen.getByText('PM2.5')).toBeInTheDocument();
  });

  it('renders units for all pollutants', () => {
    useSelector.mockReturnValue(mockAirData);

    render(React.createElement(AirPollution));

    const units = screen.getAllByText('μg/m3');
    expect(units).toHaveLength(4);
  });

  it('calls color functions with correct data values', () => {
    useSelector.mockReturnValue(mockAirData);

    render(React.createElement(AirPollution));

    expect(no2).toHaveBeenCalledWith(30);
    expect(pm10).toHaveBeenCalledWith(35);
    expect(o3).toHaveBeenCalledWith(100);
    expect(pm25).toHaveBeenCalledWith(25);
  });

  it('renders TableData components with correct props for values', () => {
    useSelector.mockReturnValue(mockAirData);

    render(React.createElement(AirPollution));

    const tableCells = screen.getAllByTestId('table-data');
    expect(tableCells).toHaveLength(8); // 4 for values + 4 for quality texts
  });

  it('renders air quality link', () => {
    useSelector.mockReturnValue(mockAirData);

    render(React.createElement(AirPollution));

    const link = screen.getByRole('link', { name: /read more about air quality index/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', 'https://en.wikipedia.org/wiki/Air_quality_index#CAQI');
  });

  it('handles missing air pollution data gracefully', () => {
    useSelector.mockReturnValue({});

    // Mock functions to handle undefined values
    no2.mockReturnValue({ color: '', text: '---' });
    pm10.mockReturnValue({ color: '', text: '---' });
    o3.mockReturnValue({ color: '', text: '---' });
    pm25.mockReturnValue({ color: '', text: '---' });

    render(React.createElement(AirPollution));

    expect(no2).toHaveBeenCalledWith(undefined);
    expect(pm10).toHaveBeenCalledWith(undefined);
    expect(o3).toHaveBeenCalledWith(undefined);
    expect(pm25).toHaveBeenCalledWith(undefined);
  });

  it('renders correct CSS class for main container', () => {
    useSelector.mockReturnValue(mockAirData);

    const { container } = render(React.createElement(AirPollution));

    const airCard = container.querySelector('.air-card');
    expect(airCard).toBeInTheDocument();
  });

  it('renders correct CSS class for title', () => {
    useSelector.mockReturnValue(mockAirData);

    const { container } = render(React.createElement(AirPollution));

    const title = container.querySelector('.title');
    expect(title).toBeInTheDocument();
    expect(title).toHaveTextContent('Air Pollution');
  });

  it('renders correct CSS class for link', () => {
    useSelector.mockReturnValue(mockAirData);

    const { container } = render(React.createElement(AirPollution));

    const link = container.querySelector('.link');
    expect(link).toBeInTheDocument();
  });

  it('renders table with correct structure', () => {
    useSelector.mockReturnValue(mockAirData);

    render(React.createElement(AirPollution));

    const table = screen.getByRole('table');
    expect(table).toBeInTheDocument();

    const tbody = table.querySelector('tbody');
    expect(tbody).toBeInTheDocument();

    const rows = tbody.querySelectorAll('tr');
    expect(rows).toHaveLength(4); // header row + 2 data rows + link row
  });

  it('renders link cell with correct colspan', () => {
    useSelector.mockReturnValue(mockAirData);

    const { container } = render(React.createElement(AirPollution));

    const linkCell = container.querySelector('td[colspan="4"]');
    expect(linkCell).toBeInTheDocument();
  });
});