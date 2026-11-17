import type { LucideIcon } from "lucide-react";
import type { UserRole } from "@/shared/types/user";

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

export interface NavigationItem extends NavItem {
  isActive: boolean;
}

export type NavConfig = Record<UserRole, NavItem[]>;
