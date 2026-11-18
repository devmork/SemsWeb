import type { LucideIcon } from "lucide-react";
import type { UserRole } from "@/shared/types/user";

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

/** A labeled group of links — renders a SidebarGroupLabel above its items. */
export interface NavSection {
  label: string;
  items: NavItem[];
}

export interface NavigationItem extends NavItem {
  isActive: boolean;
}

export interface NavigationSection {
  label: string;
  items: NavigationItem[];
}

export type NavConfig = Record<UserRole, NavSection[]>;
