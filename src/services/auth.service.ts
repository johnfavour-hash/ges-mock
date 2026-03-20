import type { LoginData, SignupFormData } from "@type/auth.type";
import axios from "axios";

// Using VITE_API_URL from environment variables, fallback to localhost for development
const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:5000";

const api = axios.create({
    baseURL: `${API_URL}/api`,
    headers: {
        "Content-Type": "application/json",
    },
});

export const AuthService = {
    login: async (payload: LoginData) => {
        console.log("AuthService: logging in...", payload.email);
        const response = await api.post("/login", payload);
        return response.data;
    },
    signup: async (payload: SignupFormData) => {
        console.log("AuthService: signing up...", payload);
        const response = await api.post("/signup", payload);
        return response.data;
    },
    logout: async () => {
        // Just clear on frontend
    },
};