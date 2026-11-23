import { create } from "zustand";
import type { UserResponse } from "@/shared/types/user";

interface AuthState {
  /** Profile only. Tokens live in the token store (localStorage) and are never duplicated here. */
  user: UserResponse | null;
  setUser: (user: UserResponse) => void;
  clearUser: () => void;
}

export const useAuthStore = create<AuthState>()((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  clearUser: () => set({ user: null }),
}));
