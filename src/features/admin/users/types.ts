import type { UserRole } from "@/shared/types/user";

/** Mirrors `SemsApi.DTO.Users.UserDto` (camelCase on the wire). */
export interface ManagedUser {
  id: number;
  email: string;
  firstName: string;
  middleName: string | null;
  lastName: string;
  pictureUrl: string | null;
  status: string;
  lastLoginAt: string | null;
  createdAt: string;
  roles: UserRole[];
}

export function fullNameOf(user: ManagedUser): string {
  return [user.firstName, user.middleName, user.lastName]
    .filter(Boolean)
    .join(" ");
}

export function initialsOf(user: ManagedUser): string {
  const first = user.firstName?.trim()[0] ?? "";
  const last = user.lastName?.trim()[0] ?? "";
  return `${first}${last}`.toUpperCase() || "?";
}

export interface UpdateUserRolesInput {
  userId: number;
  roles: UserRole[];
}
