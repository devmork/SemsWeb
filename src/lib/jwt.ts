import { jwtDecode } from "jwt-decode";
import type { UserRole } from "@/types/domain";

export interface JwtClaims {
  sub: string;
  name: string;
  email: string;
  role: UserRole;
  exp: number;
}

export function decodeToken(token: string): JwtClaims {
  const raw = jwtDecode<JwtClaims>(token);
  return {
    ...raw,
    role: raw.role.toLowerCase() as UserRole,
  };
}

export function isTokenExpired(claims: JwtClaims): boolean {
  return claims.exp * 1000 < Date.now();
}
