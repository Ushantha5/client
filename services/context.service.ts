import axios from 'axios';

const API_URL = '';

export interface LocationContextData {
    hometown: {
        country: string;
        state: string;
        city: string;
        latitude: number;
        longitude: number;
    };
    weather: {
        condition: string;
        temperature: number;
        humidity: number;
        windSpeed: number;
        lastUpdated: string;
    };
    uiPreferences: {
        theme: string;
        currentColors: string[];
        dayNightMode: 'day' | 'night';
    };
}

class ContextService {
    static async syncContext(locationData: any) {
        try {
            const response = await axios.post(`${API_URL}/api/context/sync`, locationData, { withCredentials: true });
            return response.data;
        } catch (error) {
            console.error('Context Sync Error:', error);
            throw error;
        }
    }

    static async getMyContext() {
        try {
            const response = await axios.get(`${API_URL}/api/context/me`, { withCredentials: true });
            return response.data;
        } catch (error) {
            console.error('Get Context Error:', error);
            throw error;
        }
    }
}

export default ContextService;
