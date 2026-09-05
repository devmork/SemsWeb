import type { UserRole } from "@/features/auth";

export interface ManagedUser {
  userId: number;
  fullName: string;
  email: string;
  role: UserRole;
  status: "Active" | "Inactive";
  lastLoginAt: string | null;
}
