import type { LoginData, SignupFormData } from "@type/auth.type";
import axios from "axios";

// Using 127.0.0.1 can be more reliable than 'localhost' in some environments
const API_URL = "http://127.0.0.1:5000/api";

const api = axios.create({
    baseURL: API_URL,
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