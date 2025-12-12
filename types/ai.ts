export interface ChatMessage {
    role: "system" | "user" | "assistant";
    content: string;
}

export interface ChatRequest {
    messages: ChatMessage[];
    options?: {
        model?: string;
        temperature?: number;
        stream?: boolean;
    };
}

export interface ChatResponse {
    choices: {
        message: ChatMessage;
    }[];
}

export interface GradeRequest {
    answer: string;
    rubric: string;
}

export interface GradeResponse {
    score: number;
    strengths: string[];
    weaknesses: string[];
    improvementAction: string;
    requiresManualReview: boolean;
}

export interface SummaryRequest {
    content: string;
}

export interface SummaryResponse {
    summary: string;
    keyTakeaways: string[];
    quiz: {
        question: string;
        options: string[];
        correctOption: number;
    }[];
}
