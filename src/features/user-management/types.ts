import type { UserRole } from "@/shared/types/user";

export interface ManagedUser {
  userId: number;
  fullName: string;
  email: string;
  role: UserRole;
  status: "Active" | "Inactive";
  lastLoginAt: string | null;
}
