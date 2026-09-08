import type { LucideIcon } from "lucide-react";
import type { UserRole } from "@/features/auth";

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

export type NavConfig = Record<UserRole, NavItem[]>;
