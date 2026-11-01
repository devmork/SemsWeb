import { api, API_BASE_URL } from "@/lib/api";
import { useAuthStore } from "@/stores/auth.store";
import type { UserResponse, UserRole } from "@/types/domain";

const USER_ROLES: readonly UserRole[] = ["admin", "qa", "student"];

function toUserRole(value: string | null): UserRole | null {
  const normalized = value?.toLowerCase();
  return USER_ROLES.find((role) => role === normalized) ?? null;
}

export function toAuthUser(user: UserResponse) {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    role: toUserRole(user.role),
    pictureUrl: user.pictureUrl,
  };
}

export async function fetchCurrentUser(): Promise<UserResponse | null> {
  try {
    const { data } = await api.get<UserResponse>("/api/auth/me", {
      skipAuthRedirect: true,
    });
    return toAuthUser(data);
  } catch {
    return null;
  }
}

export function startGoogleSignIn(returnUrl = "/") {
  const url = new URL("/api/auth/google/signin", API_BASE_URL);
  url.searchParams.set("returnUrl", returnUrl);
  window.location.assign(url.toString());
}

export async function logout(): Promise<void> {
  try {
    await api.post("/api/auth/logout", undefined, { skipAuthRedirect: true });
  } finally {
    useAuthStore.getState().clearUser();
  }
}
