export interface User {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    dob?: string;
    role: 'user' | 'admin';
    isVerified: string;
    createdAt: string;
    updatedAt: string;
};

export interface AuthResponse {
    message: string;
    user: User;
    tokens: {
        accessToken: string;
        refreshToken: string;
    };
}

export interface TokenResponse {
    accessToken: string;
    refreshToken: string;
};

export interface RegisterPayload {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    dob?: string;
};

export interface LoginPayload {
    email: string;
    password: string;
}