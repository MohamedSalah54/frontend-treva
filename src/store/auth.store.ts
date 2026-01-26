// import { create } from "zustand";
// import { User } from "@/src/types/user";

// interface AuthState {
//   user: User | null;
//   setUser: (user: User | null) => void;
//   logout: () => void;
// }

// export const useAuthStore = create<AuthState>((set) => ({
//   user: null,

//   setUser: (user) => {
//     set({ user });
//   },

//   logout: () => {
//     document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
//     set({ user: null });
//   },
// }));

import { create } from "zustand";
import { jwtDecode } from "jwt-decode";
import { Role } from "../types/task";
import { logoutRequest } from "../services/auth";

interface JWTUser {
  id: string;
  email: string;
  role?: Role;
  firstName?: string;
  lastName?: string;
  profileImage?: {
    secure_url?: string;
    public_id?: string;
    folderId?: string;
  };
  whatsappLink: string;
}

interface AuthState {
  user: JWTUser | null;
  setUser: (user: JWTUser | null) => void;
  patchUser: (patch: Partial<JWTUser>) => void;

  logout: () => void;
  initUserFromCookie: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,

  patchUser: (patch) =>
    set((state) => ({
      user: state.user ? { ...state.user, ...patch } : (null as any),
    })),
  setUser: (user) => set({ user }),

  logout: async () => {
    try {
      await logoutRequest(); // ده ينادي /auth/logout
    } catch (e) {
      console.error("logout error", e);
    } finally {
      set({ user: null });
    }
  },
  initUserFromCookie: () => {
    const cookies = document.cookie.split(";").map((c) => c.trim());
    const tokenCookie = cookies.find((c) => c.startsWith("access_token="));
    if (!tokenCookie) return;

    const token = tokenCookie.split("=")[1];
    try {
      const decoded = jwtDecode<JWTUser>(token);
      set({ user: decoded });
    } catch (err) {
      console.error("Invalid access token", err);
      set({ user: null });
    }
  },
}));
