import PricingService from '../../services/pricing.service';
import axios from 'axios';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('PricingService', () => {
    it('should calculate price correctly', async () => {
        const mockResponse = {
            data: {
                success: true,
                data: {
                    totalPrice: 110,
                    currency: 'USD'
                }
            }
        };

        mockedAxios.post.mockResolvedValueOnce(mockResponse);

        const result = await PricingService.calculatePrice(100, { country: 'USA' });

        expect(result.success).toBe(true);
        expect(result.data.totalPrice).toBe(110);
        expect(mockedAxios.post).toHaveBeenCalledWith(
            expect.stringContaining('/pricing/calculate'),
            { basePrice: 100, location: { country: 'USA' } }
        );
    });

    it('should handle errors', async () => {
        mockedAxios.post.mockRejectedValueOnce(new Error('Network Error'));

        await expect(PricingService.calculatePrice(100, { country: 'USA' }))
            .rejects.toThrow('Network Error');
    });
});
