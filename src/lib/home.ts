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
      return "/forbidden";
  }
}
