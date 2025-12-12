export interface Teacher {
    _id: string;
    specialization?: string;
    bio?: string;
    user?: {
        name?: string;
        email?: string;
    };
    createdAt?: Date;
    updatedAt?: Date;
}

export interface CreateTeacherData {
    specialization?: string;
    bio?: string;
    userId?: string;
}

export interface UpdateTeacherData {
    specialization?: string;
    bio?: string;
}
