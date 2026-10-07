import { redirect } from "@tanstack/react-router";
import { useAuthStore } from "@/stores/auth.store";
import { decodeToken, isTokenExpired, type JwtClaims } from "@/lib/jwt";
import type { UserRole } from "@/types/domain";

export function requireAuth(): void {
  const { token, logout } = useAuthStore.getState();

  if (!token) throw redirect({ to: "/login" });

  let claims: JwtClaims;
  try {
    claims = decodeToken(token);
  } catch {
    logout();
    throw redirect({ to: "/login" });
  }

  if (isTokenExpired(claims)) {
    logout();
    throw redirect({ to: "/login" });
  }
}

export function requireRole(...allowed: UserRole[]): void {
  requireAuth();

  const role = useAuthStore.getState().user?.role;
  if (!role || !allowed.includes(role)) {
    throw redirect({ to: "/forbidden" });
  }
}
