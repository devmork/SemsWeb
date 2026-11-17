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

export interface UpdateUserRolesInput {
  userId: number;
  roles: UserRole[];
}
