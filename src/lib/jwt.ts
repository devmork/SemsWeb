import { jwtDecode } from "jwt-decode";
import type { UserRole } from "@/features/auth";

interface JwtClaims {
  sub: string;
  name: string;
  email: string;
  role: UserRole;
  exp: number;
}

export function decodeToken(token: string): JwtClaims {
  return jwtDecode<JwtClaims>(token);
}

export function isTokenExpired(claims: JwtClaims): boolean {
  return claims.exp * 1000 < Date.now();
}
