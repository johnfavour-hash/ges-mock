import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface UserState {
    name: string;
    email: string;
    password: string;
}

interface UserActions {
    setUser: (user: UserState) => void;
    clearUser: () => void;
}

type UserStoreType = UserState & UserActions;

const useUserStore = create<UserStoreType>()(
    persist(
        (set) => ({
            name: "",
            email: "",
            password: "",
            setUser: (user) => set(user),
            clearUser: () => set({ name: "", email: "", password: "" }),
        }),
        {
            name: "user-store",
            storage: createJSONStorage(() => localStorage),
            partialize: (state) => ({
                name: state.name,
                email: state.email,
                password: state.password,
            }),
        }
    )
);

export default useUserStore;