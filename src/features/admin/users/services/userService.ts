import { api } from "@/shared/api/client";
import type { UserRole } from "@/shared/types/user";
import type { ManagedUser } from "../types";

/** Mirrors `SemsApi.DTO.Users.UserDto`. */
type UserDto = {
  id: number;
  email: string;
  firstName: string;
  middleName: string | null;
  lastName: string;
  pictureUrl: string | null;
  status: string;
  lastLoginAt: string | null;
  createdAt: string;
  roles: string[];
};

function toUserRole(role: string): UserRole {
  const normalized = role.toLowerCase();
  if (normalized === "admin" || normalized === "qa") return normalized;
  return "student";
}

function toManagedUser(dto: UserDto): ManagedUser {
  return {
    id: dto.id,
    email: dto.email,
    firstName: dto.firstName ?? "",
    middleName: dto.middleName,
    lastName: dto.lastName ?? "",
    pictureUrl: dto.pictureUrl,
    status: dto.status ?? "",
    lastLoginAt: dto.lastLoginAt,
    createdAt: dto.createdAt ?? "",
    roles: Array.isArray(dto.roles) ? dto.roles.map(toUserRole) : [],
  };
}

/**
 * Normalize a list response. The backend returns a plain array, but a wrong
 * base URL makes the dev server reply with `index.html` (a string), and some
 * endpoints wrap payloads in `{ message, data }`. Never feed a non-array to
 * `.map` — that produced the "data.map is not a function" crash.
 */
function toDtoArray<T>(payload: unknown): T[] {
  if (Array.isArray(payload)) return payload as T[];
  if (
    payload &&
    typeof payload === "object" &&
    "data" in payload &&
    Array.isArray((payload as { data: unknown }).data)
  ) {
    return (payload as { data: T[] }).data;
  }
  return [];
}

export interface GetUsersParams {
  search?: string | undefined;
  role?: string | undefined;
}

export const userService = {
  /** `GET /api/users` — query params `search` / `role` (admin only). */
  async getUsers(params?: GetUsersParams): Promise<ManagedUser[]> {
    const { data } = await api.get<unknown>("/api/users", {
      params: {
        ...(params?.search ? { search: params.search } : {}),
        ...(params?.role ? { role: params.role } : {}),
      },
    });
    return toDtoArray<UserDto>(data).map(toManagedUser);
  },

  async getUser(id: number): Promise<ManagedUser> {
    const { data } = await api.get<UserDto>(`/api/users/${id}`);
    return toManagedUser(data);
  },

  /** `PUT /api/users/{id}/roles` — replaces the full role set. */
  async updateUserRoles(
    id: number,
    roles: UserRole[],
  ): Promise<ManagedUser> {
    const { data } = await api.put<UserDto>(`/api/users/${id}/roles`, {
      roles,
    });
    return toManagedUser(data);
  },
};
