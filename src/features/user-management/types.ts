import type { UserRole } from "@/types/domain";

export interface ManagedUser {
  userId: number;
  fullName: string;
  email: string;
  role: UserRole;
  status: "Active" | "Inactive";
  lastLoginAt: string | null;
}
