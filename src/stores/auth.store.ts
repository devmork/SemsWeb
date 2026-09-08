import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { AuthUser } from "@/features/auth";
import { decodeToken, isTokenExpired } from "@/lib/jwt";

interface AuthState {
  user: AuthUser | null;
  token: string | null;
  setToken: (token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      setToken: (token) => {
        const claims = decodeToken(token);
        if (isTokenExpired(claims)) {
          set({ user: null, token: null });
          return;
        }
        set({
          token,
          user: {
            id: claims.sub,
            name: claims.name,
            email: claims.email,
            role: claims.role,
          },
        });
      },
      logout: () => set({ user: null, token: null }),
    }),
    { name: "sems-auth" },
  ),
);
