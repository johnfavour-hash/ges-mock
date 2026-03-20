
export interface AuthState {
    id: number | null;
    token: string;
    refreshToken: string;
    expireAt: string;
    fullName: string;
    email: string;
    role: 'student' | 'admin' | null;
    setAuth: (auth: Partial<AuthState>) => void;
    clearAuth: () => void;
}


// login
export interface LoginData {
    email: string;
    password: string;
}
export interface LoginResponse {
    id: number;
    fullName: string;
    email: string;
    role: 'student' | 'admin';
    token?: string;
    refreshToken?: string;
    expireAt?: string;
}

// signup
export type { SignupFormData } from "@schemas/auth/signup.schema";
export interface SignupData {
    name: string;
    email: string;
    password: string;
}
export interface SignupResponse {
    id: number;
    fullName: string;
    email: string;
    role: 'student';
    token?: string;
    refreshToken?: string;
    expireAt?: string;
}
