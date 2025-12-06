export interface AIInteraction {
    _id?: string;
    user: string;
    course?: string;
    question: string;
    response?: string;
    mode: "text" | "voice";
    timestamp?: Date;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface CreateAIInteractionData {
    user: string;
    course?: string;
    question: string;
    response?: string;
    mode: "text" | "voice";
}

export interface UpdateAIInteractionData {
    question?: string;
    response?: string;
    mode?: "text" | "voice";
}
