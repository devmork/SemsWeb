import { redirect } from "@tanstack/react-router";
import { fetchCurrentUser } from "@/features/auth";
import { homePathFor } from "@/lib/home";
import { useAuthStore } from "@/stores/auth.store";
import type { AuthUser, UserRole } from "@/types/domain";

let sessionPromise: Promise<AuthUser | null> | null = null;

/**
 * Resolves the current user. The first call asks the backend (cookies are sent
 * automatically); later calls use the store.
 */
export function restoreSession(): Promise<AuthUser | null> {
  const cached = useAuthStore.getState().user;
  if (cached) return Promise.resolve(cached);

  if (!sessionPromise) {
    sessionPromise = fetchCurrentUser()
      .then((user) => {
        if (user) useAuthStore.getState().setUser(user);
        return user;
      })
      .finally(() => {
        sessionPromise = null;
      });
  }
  return sessionPromise;
}

export async function requireAuth(): Promise<AuthUser> {
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

/** For the login page and the root route: signed-in users go to their home. */
export async function redirectIfAuthenticated(): Promise<void> {
  const user = await restoreSession();
  if (user) throw redirect({ to: homePathFor(user.role) });
}
