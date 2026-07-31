import { create } from "zustand";

interface User {
  id: string;
  email: string;
  name?: string;
  role: "CUSTOMER" | "ADMIN";
}

interface AuthState {
  accessToken: string | null;
  user: User | null;
  setAuth: (token: string, user: User) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  accessToken:
    typeof window !== "undefined" ? localStorage.getItem("accessToken") : null,
  user: null,

  setAuth: (token, user) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("accessToken", token);
    }
    set({ accessToken: token, user: user });
  },

  logout: () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("accessToken");
    }
    set({ accessToken: null, user: null });
  },
}));
