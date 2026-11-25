import { redirect } from "@tanstack/react-router";
import { fetchCurrentUser } from "./services/authService";
import { homePathFor } from "@/shared/lib/home";
import { useAuthStore } from "./stores/auth.store";
import { tokenStore } from "@/shared/api/client";
import type { UserResponse, UserRole } from "@/shared/types/user";

/**
 * Session lookup is keyed by the access token so a signed-out (or failed)
 * check is resolved once per token instead of on every route guard run.
 * Token rotation produces a new key, so a refreshed session is re-checked.
 */
let sessionCheck: {
  token: string | null;
  result: Promise<UserResponse | null>;
} | null = null;

// const isDev = import.meta.env.DEV;

// const MOCK_DEV_USER: UserResponse = {
//   id: 1,
//   name: "Den Mark Enoy",
//   email: "den_enoy@dmc.edu.ph",
//   role: "admin",
//   pictureUrl: null,
//   studentProfile: {
//     studentId: 1,
//     studentNumber: "2023-0444",
//     gradeLevel: "Grade 3",
//     section: "BSIT-3A",
//     schoolYear: "2026-2027",
//     term: 1,
//     status: "Enrolled",
//     subjects: [],
//   },
// };

export function restoreSession(): Promise<UserResponse | null> {
  // if (isDev) {
  //   useAuthStore.getState().setUser(MOCK_DEV_USER);
  //   return Promise.resolve(MOCK_DEV_USER);
  // }

  const cached = useAuthStore.getState().user;
  if (cached) return Promise.resolve(cached);

  const token = tokenStore.getAccessToken();
  // No token means there is no session to check: avoid a doomed request that
  // blocks navigation until CORS/network fails.
  if (!token) return Promise.resolve(null);

  if (sessionCheck?.token === token) return sessionCheck.result;

  sessionCheck = {
    token,
    result: fetchCurrentUser().then((user) => {
      if (user) useAuthStore.getState().setUser(user);
      return user;
    }),
  };
  return sessionCheck.result;
}

export async function requireAuth(): Promise<UserResponse> {
  const user = await restoreSession();
  if (!user) throw redirect({ to: "/login" });
  return user;
}

export async function requireRole(...allowed: UserRole[]): Promise<void> {
  const user = await requireAuth();
  if (!user.role || !allowed.includes(user.role)) {
    throw redirect({ to: "/forbidden" });
  }
}

export async function redirectIfAuthenticated(): Promise<void> {
  const user = await restoreSession();
  if (user) throw redirect({ to: homePathFor(user.role) });
}
