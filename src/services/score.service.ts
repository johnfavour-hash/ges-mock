import { axiosClient } from "@configs/axios.config";

export interface StudentResult {
    fullName: string;
    email: string;
    score: number | null;
    total: number | null;
    date: string | null;
}

export const ScoreService = {
    submitScore: async (userId: number, score: number, total: number) => {
        const response = await axiosClient.post("/scores", { userId, score, total });
        return response.data;
    },
    getAdminResults: async (): Promise<StudentResult[]> => {
        const response = await axiosClient.get("/admin/results");
        return response.data;
    },
    getUserScore: async (userId: number): Promise<{ score: number, total: number } | null> => {
        const response = await axiosClient.get(`/scores/${userId}`);
        return response.data;
    }
};
