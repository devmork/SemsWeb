import type { UserRole } from "@/types/domain";

export type HomePath = "/admin" | "/qa" | "/student" | "/forbidden";

export function homePathFor(role: UserRole | null): HomePath {
  switch (role) {
    case "admin":
      return "/admin";
    case "qa":
      return "/qa";
    case "student":
      return "/student";
    default:
      // no role means no dashboard, and /forbidden does not redirect, so there is no loop
      return "/forbidden";
  }
}
