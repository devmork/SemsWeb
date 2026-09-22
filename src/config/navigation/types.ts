import type { LucideIcon } from "lucide-react";
import type { UserRole } from "@/types/domain";

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

export type NavConfig = Record<UserRole, NavItem[]>;
