import { api, API_BASE_URL } from "@/lib/api";
import { useAuthStore } from "@/stores/auth.store";
import type { AuthUser, UserRole } from "@/types/domain";
import type { UserResponse } from "../types";

const USER_ROLES: readonly UserRole[] = ["admin", "qa", "student"];

/** The backend sends one role name ("Admin", "Qa", "Student"). Unknown roles become null. */
function toUserRole(value: string | null): UserRole | null {
  const normalized = value?.toLowerCase();
  return USER_ROLES.find((role) => role === normalized) ?? null;
}

export function toAuthUser(user: UserResponse): AuthUser {
  return {
    id: user.id,
    email: user.email,
    name: `${user.firstName} ${user.lastName}`.trim(),
    role: toUserRole(user.role),
    pictureUrl: user.pictureUrl,
  };
}

/** Returns the signed-in user, or null. Never redirects. */
export async function fetchCurrentUser(): Promise<AuthUser | null> {
  try {
    const { data } = await api.get<UserResponse>("/api/auth/me", {
      skipAuthRedirect: true,
    });
    return toAuthUser(data);
  } catch {
    return null;
  }
}

/** Full-page navigation, not an XHR. The backend runs the Google redirect flow and sets the cookies. */
export function startGoogleSignIn(returnUrl = "/") {
  const url = new URL("/api/auth/google/signin", API_BASE_URL);
  url.searchParams.set("returnUrl", returnUrl);
  window.location.assign(url.toString());
}

export async function logout(): Promise<void> {
  try {
    await api.post("/api/auth/logout", undefined, { skipAuthRedirect: true });
  } finally {
    // Clear locally even if the request failed. The backend clears the cookies on success.
    useAuthStore.getState().clearUser();
  }
}
