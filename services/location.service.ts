import axios from 'axios';

export interface LocationData {
  country: string;
  state?: string;
  city?: string;
  method?: string;
  region?: string;
  latitude?: number | null;
  longitude?: number | null;
  isTamilNadu?: boolean;
  isSriLanka?: boolean;
  isTamilRegion?: boolean;
}

class LocationService {
  /**
   * Get user location using Browser Geolocation API
   */
  static async getBrowserLocation(): Promise<LocationData> {
    return new Promise<LocationData>((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation not supported'));
      }

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          try {
            // Reverse geocoding using a public API (e.g., Nominatim)
            const response = await axios.get(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=10&addressdetails=1`);
            const address = response.data.address;
            resolve({
              country: address.country,
              state: address.state || address.region,
              city: address.city || address.town || address.village,
              method: 'browser'
            });
          } catch (error) {
            reject(error);
          }
        },
        (error) => {
          reject(error);
        }
      );
    });
  }

  /**
   * Fallback to IP-based location
   */
  static async getIpLocation(): Promise<LocationData> {
    try {
      const response = await axios.get('https://ipapi.co/json/');
      return {
        country: response.data.country_name,
        state: response.data.region,
        city: response.data.city,
        method: 'ip'
      };
    } catch (error) {
      console.error('IP Location Error:', error);
      throw error;
    }
  }

  /**
   * Unified method to get location with fallback
   */
  static async getLocation(): Promise<LocationData | null> {
    try {
      // Try browser first
      return await this.getBrowserLocation();
    } catch (error: any) {
      console.warn('Browser location failed, falling back to IP:', error.message);
      try {
        // Fallback to IP
        return await this.getIpLocation();
      } catch (ipError: any) {
        console.error('All location methods failed');
        return null;
      }
    }
  }
}

export default LocationService;