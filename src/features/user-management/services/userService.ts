import { api } from "@/shared/api/client";
import type { UserRole } from "@/shared/types/user";
import type { ManagedUser } from "../types";

export const userService = {
  async getUsers(): Promise<ManagedUser[]> {
    const { data } = await api.get<ManagedUser[]>("/admin/users");
    return data;
  },

  async updateUserRole(userId: number, role: UserRole): Promise<void> {
    await api.post(`/superadmin/users/${userId}/role`, { role });
  },
};
