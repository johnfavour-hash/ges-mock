import { axiosClient } from "@configs/axios.config";
import type { LoginData, SignupFormData } from "@type/auth.type";

export const AuthService = {
    login: async (payload: LoginData) => {
        console.log("AuthService: logging in...", payload.email);
        const response = await axiosClient.post("/login", payload);
        return response.data;
    },
    signup: async (payload: SignupFormData) => {
        console.log("AuthService: signing up...", payload);
        const response = await axiosClient.post("/signup", payload);
        return response.data;
    },
    logout: async () => {
        // Just clear on frontend
    },
};