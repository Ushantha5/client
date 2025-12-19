import apiClient from "@/lib/apiClient";

// Define types for better type safety
interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string | { text: string; images?: string[] };
}

interface ChatOptions {
  model?: string;
  temperature?: number;
  max_tokens?: number;
  multimodal?: boolean;
}

interface ChatResponse {
  choices: {
    message: {
      role: string;
      content: string;
      tool_calls?: any[];
    };
  }[];
}

interface GeminiResponse {
  response: string;
}

export const aiService = {
  chat: async (data: { messages: ChatMessage[]; options?: ChatOptions }) => {
    const response = await apiClient.post<ChatResponse>("/api/ai/chat", data);
    return response.data;
  },

  geminiChat: async (data: {
    message?: string;
    messages?: ChatMessage[];
    options?: ChatOptions
  }) => {
    const response = await apiClient.post<GeminiResponse>("/api/ai/gemini", data);
    return response.data;
  },

  ollamaChat: async (data: { messages: ChatMessage[]; options?: ChatOptions }) => {
    const response = await apiClient.post<ChatResponse>("/api/ai/ollama", data);
    return response.data;
  },

  summarize: async (data: { content: string }) => {
    const response = await apiClient.post("/api/ai/summary", data);
    return response.data;
  },

  grade: async (data: { answer: string; rubric: string }) => {
    const response = await apiClient.post("/api/ai/grade", data);
    return response.data;
  },

  gradeAssignment: async (data: { answer: string; rubric: string }) => {
    const response = await apiClient.post("/api/ai/grade", data);
    return response.data;
  },

  detectRegionalInfo: async (location: string) => {
    const response = await apiClient.post("/api/ai/detect-regional-info", { location });
    return response.data;
  },

  // New method for emotional analysis
  analyzeEmotions: async (_conversationHistory: ChatMessage[]) => {
    // This would be a new endpoint in the backend
    // For now, we'll simulate the response
    return {
      emotionalState: "engaged",
      confidenceLevel: 85,
      engagementScore: 90,
      suggestedApproach: "Continue with current teaching approach",
      nextTopicSuggestion: "Related concepts"
    };
  }
};