import type { UserRole } from "@/shared/types/user";

export type HomePath =
  | "/admin/users"
  | "/qa/categories"
  | "/student/teachers"
  | "/forbidden";

export function homePathFor(role: UserRole | null): HomePath {
  switch (role) {
    case "admin":
      return "/admin/users";
    case "qa":
      return "/qa/categories";
    case "student":
      return "/student/teachers";
    default:
      return "/forbidden";
  }
}
