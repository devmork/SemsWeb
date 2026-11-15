import { api } from "@/shared/api/client";
import type { UserRole } from "@/shared/types/user";
import type { ManagedUser } from "../types";

/**
 * WARNING — no backend contract exists for these calls.
 *
 * `SemsApi` currently exposes no user-management endpoints: there is no
 * `AdminController`/`UserController`, and no `GET /admin/users` or
 * `POST /superadmin/users/{id}/role` route. These paths are placeholders kept
 * only so the admin UI compiles. They must be replaced once the backend adds
 * user listing / role-assignment endpoints (or the feature should be removed).
 */
export const userService = {
  async getUsers(): Promise<ManagedUser[]> {
    const { data } = await api.get<ManagedUser[]>("/admin/users");
    return data;
  },

  async updateUserRole(userId: number, role: UserRole): Promise<void> {
    await api.post(`/superadmin/users/${userId}/role`, { role });
  },
};
