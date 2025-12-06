import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export interface AIInteraction {
    _id?: string;
    user: string;
    course?: string;
    question: string;
    response?: string;
    mode: 'text' | 'voice';
    timestamp?: Date;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface PaginatedResponse<T> {
    success: boolean;
    data: T[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        pages: number;
    };
}

export interface SingleResponse<T> {
    success: boolean;
    data: T;
}

export interface ErrorResponse {
    success: false;
    error: string;
}

class AIAssistantAPI {
    private baseURL: string;

    constructor() {
        this.baseURL = `${API_BASE_URL}/aI_Assistant_Interctions`;
    }

    /**
     * Get all AI assistant interactions with pagination and filters
     */
    async getAllInteractions(params?: {
        page?: number;
        limit?: number;
        user?: string;
        course?: string;
        mode?: 'text' | 'voice';
        search?: string;
    }): Promise<PaginatedResponse<AIInteraction>> {
        try {
            const response = await axios.get(this.baseURL, { params });
            return response.data;
        } catch (error) {
            console.error('Error fetching AI interactions:', error);
            throw error;
        }
    }

    /**
     * Get a single AI interaction by ID
     */
    async getInteractionById(id: string): Promise<SingleResponse<AIInteraction>> {
        try {
            const response = await axios.get(`${this.baseURL}/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching AI interaction:', error);
            throw error;
        }
    }

    /**
     * Create a new AI interaction
     */
    async createInteraction(
        data: Omit<AIInteraction, '_id' | 'createdAt' | 'updatedAt'>
    ): Promise<SingleResponse<AIInteraction>> {
        try {
            const response = await axios.post(this.baseURL, data);
            return response.data;
        } catch (error) {
            console.error('Error creating AI interaction:', error);
            throw error;
        }
    }

    /**
     * Update an existing AI interaction
     */
    async updateInteraction(
        id: string,
        data: Partial<AIInteraction>
    ): Promise<SingleResponse<AIInteraction>> {
        try {
            const response = await axios.put(`${this.baseURL}/${id}`, data);
            return response.data;
        } catch (error) {
            console.error('Error updating AI interaction:', error);
            throw error;
        }
    }

    /**
     * Delete an AI interaction
     */
    async deleteInteraction(id: string): Promise<{ success: boolean; message: string }> {
        try {
            const response = await axios.delete(`${this.baseURL}/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error deleting AI interaction:', error);
            throw error;
        }
    }

    /**
     * Get user's interaction history
     */
    async getUserHistory(userId: string, page = 1, limit = 20): Promise<PaginatedResponse<AIInteraction>> {
        return this.getAllInteractions({ user: userId, page, limit });
    }

    /**
     * Get course-specific interactions
     */
    async getCourseInteractions(courseId: string, page = 1, limit = 20): Promise<PaginatedResponse<AIInteraction>> {
        return this.getAllInteractions({ course: courseId, page, limit });
    }

    /**
     * Search interactions
     */
    async searchInteractions(query: string, page = 1, limit = 20): Promise<PaginatedResponse<AIInteraction>> {
        return this.getAllInteractions({ search: query, page, limit });
    }
}

export const aiAssistantAPI = new AIAssistantAPI();
