import type { AuthState } from "@type/auth.type";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";



const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            id: null,
            token: "",
            refreshToken: "",
            expireAt: "",
            fullName: "",
            email: "",
            role: null,
            setAuth: (auth) => set((state) => ({ ...state, ...auth })),
            clearAuth: () => set({ id: null, token: "", refreshToken: "", expireAt: "", fullName: "", email: "", role: null }),
        }),
        {
            name: "user-store",
            storage: createJSONStorage(() => localStorage),
            partialize: (state) => ({
                id: state.id,
                token: state.token,
                refreshToken: state.refreshToken,
                expireAt: state.expireAt,
                fullName: state.fullName,
                email: state.email,
                role: state.role,
            }),
        }
    )
);

export default useAuthStore;