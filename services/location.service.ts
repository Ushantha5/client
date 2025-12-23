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

export const DEFAULT_LOCATION: LocationData = {
  country: 'Universal',
  region: 'Earth',
  city: 'Global',
  isSriLanka: false,
  isTamilNadu: false,
  isTamilRegion: false
};

class LocationService {
  /**
   * Get user location using Browser Geolocation API
   */
  static async getBrowserLocation(): Promise<LocationData> {
    return new Promise<LocationData>((resolve, reject) => {
      if (typeof window === 'undefined' || !navigator.geolocation) {
        return reject(new Error('Geolocation not supported'));
      }

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          try {
            // Reverse geocoding using a public API (e.g., Nominatim)
            const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=10&addressdetails=1`);
            if (!response.ok) throw new Error('Reverse geocoding failed');

            const data = await response.json();
            const address = data.address;

            const country = address.country || '';
            const isSriLanka = country.toLowerCase() === 'sri lanka';
            const state = address.state || address.region || '';
            const isTamilNadu = state.toLowerCase().includes('tamil nadu');
            const city = address.city || address.town || address.village || '';
            const isTamilRegion = isSriLanka && (
              city.toLowerCase().includes('vavuniya') ||
              city.toLowerCase().includes('jaffna') ||
              city.toLowerCase().includes('mullaitivu') ||
              city.toLowerCase().includes('kilinochchi') ||
              city.toLowerCase().includes('mannar') ||
              city.toLowerCase().includes('batticaloa') ||
              city.toLowerCase().includes('trincomalee') ||
              city.toLowerCase().includes('ampara')
            );

            resolve({
              country,
              region: state,
              state: state,
              city,
              latitude,
              longitude,
              isSriLanka,
              isTamilNadu,
              isTamilRegion,
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
      const response = await fetch('https://ipapi.co/json/');
      if (!response.ok) throw new Error('IP geolocation failed');

      const data = await response.json();

      const isSriLanka = data.country_name?.toLowerCase() === 'sri lanka';
      const isTamilNadu = data.region?.toLowerCase().includes('tamil nadu');
      const city = data.city || '';
      const isTamilRegion = isSriLanka && (
        city.toLowerCase().includes('vavuniya') ||
        city.toLowerCase().includes('jaffna')
      );

      return {
        country: data.country_name,
        region: data.region,
        state: data.region,
        city: data.city,
        latitude: data.latitude,
        longitude: data.longitude,
        isSriLanka,
        isTamilNadu,
        isTamilRegion,
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
        return DEFAULT_LOCATION;
      }
    }
  }
}

// Standalone functions for compatibility with existing tests
export const getLocationFromIP = async () => {
  try {
    return await LocationService.getIpLocation();
  } catch (error) {
    return DEFAULT_LOCATION;
  }
};

export const detectUserLocation = async () => {
  return await LocationService.getLocation();
};

export default LocationService;