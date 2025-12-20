import axios from 'axios';

const API_URL = '/api';

class PricingService {
    static async calculatePrice(basePrice: number, location: { country: string, state?: string, city?: string }) {
        try {
            const response = await axios.post(`${API_URL}/pricing/calculate`, {
                basePrice,
                location
            });
            return response.data;
        } catch (error) {
            console.error('Pricing Calculation Error:', error);
            throw error;
        }
    }
}

export default PricingService;
