export interface User {
    id: string;
    name: string;
    email: string;
    role: "student" | "AI-TEACHER" | "admin";
    status: string;
    avatarUrl?: string;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface RegisterData {
    name: string;
    email: string;
    password: string;
    role?: "student" | "AI-TEACHER";
}

export interface UserProfile extends User {
    bio?: string;
    avatar?: string;
    phone?: string;
    // Add other profile fields as needed
}
