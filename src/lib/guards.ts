import { redirect } from "@tanstack/react-router";
import { useAuthStore } from "@/stores/auth.store";
import { decodeToken, isTokenExpired } from "@/lib/jwt";
import type { UserRole } from "@/types/domain";

export function requireAuth() {
  const { token } = useAuthStore.getState();
  if (!token) throw redirect({ to: "/login" });

  try {
    if (isTokenExpired(decodeToken(token))) {
      useAuthStore.getState().logout();
      throw redirect({ to: "/login" });
    }
  } catch {
    useAuthStore.getState().logout();
    throw redirect({ to: "/login" });
  }
}

export function requireRole(...allowed: UserRole[]) {
  requireAuth();
  const role = useAuthStore.getState().user?.role;
  if (!role || !allowed.includes(role)) {
    throw redirect({ to: "/forbidden" });
  }
}
