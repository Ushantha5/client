// Mock the fetch API for testing
global.fetch = jest.fn();

// Import the functions to test
import { getLocationFromIP, detectUserLocation, DEFAULT_LOCATION } from '../location.service';

describe('Location Service', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  describe('getLocationFromIP', () => {
    it('should return location data when IP geolocation succeeds', async () => {
      // Mock a successful response from ipapi.co
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({
          country_name: 'India',
          region: 'Tamil Nadu',
          region_code: 'TN',
          city: 'Chennai',
          latitude: 13.0827,
          longitude: 80.2707
        })
      });

      const result = await getLocationFromIP();

      expect(result).toMatchObject({
        country: 'India',
        region: 'Tamil Nadu',
        city: 'Chennai',
        latitude: 13.0827,
        longitude: 80.2707,
        isTamilNadu: true
      });
    });

    it('should return default location when IP geolocation fails', async () => {
      // Mock a failed response
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 500
      });

      const result = await getLocationFromIP();

      expect(result).toMatchObject(DEFAULT_LOCATION);
    });
  });

  describe('detectUserLocation', () => {
    it('should return default location when both detection methods fail', async () => {
      // Mock navigator.geolocation to simulate unsupported browser
      Object.defineProperty(navigator, 'geolocation', {
        value: undefined,
        writable: true
      });

      // Mock IP geolocation to also fail
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 500
      });

      const result = await detectUserLocation();

      expect(result).toMatchObject(DEFAULT_LOCATION);
    });
  });
});