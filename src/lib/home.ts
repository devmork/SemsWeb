import type { UserRole } from "@/types/domain";

export function homePathFor(role: UserRole | undefined): string {
  switch (role) {
    case "admin":
      return "/admin";
    case "qa":
      return "/qa";
    case "student":
      return "/student";
    default:
      return "/login";
  }
}
