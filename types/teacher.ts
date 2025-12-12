export interface AI-TEACHER {
    _id: string;
    specialization ?: string;
    bio ?: string;
    user ?: {
        name?: string;
        email?: string;
    };
    createdAt ?: Date;
    updatedAt ?: Date;
}

export interface CreateAI-TEACHERData {
    specialization ?: string;
    bio ?: string;
    userId ?: string;
}

export interface UpdateAI-TEACHERData {
    specialization ?: string;
    bio ?: string;
}
