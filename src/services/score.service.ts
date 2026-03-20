import axios from "axios";

const API_URL = "http://127.0.0.1:5000/api";

const api = axios.create({
    baseURL: API_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

export interface StudentResult {
    fullName: string;
    email: string;
    score: number | null;
    total: number | null;
    date: string | null;
}

export const ScoreService = {
    submitScore: async (userId: number, score: number, total: number) => {
        const response = await api.post("/scores", { userId, score, total });
        return response.data;
    },
    getAdminResults: async (): Promise<StudentResult[]> => {
        const response = await api.get("/admin/results");
        return response.data;
    },
    getUserScore: async (userId: number): Promise<{ score: number, total: number } | null> => {
        const response = await api.get(`/scores/${userId}`);
        return response.data;
    }
};
