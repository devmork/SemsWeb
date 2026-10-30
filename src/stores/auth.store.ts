import { create } from "zustand";
import type { AuthUser } from "@/types/domain";

interface AuthState {
  /** Profile only. The tokens are HttpOnly cookies and are never readable here. */
  user: AuthUser | null;
  setUser: (user: AuthUser) => void;
  clearUser: () => void;
}

export const useAuthStore = create<AuthState>()((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  clearUser: () => set({ user: null }),
}));
