import { useMatchRoute } from "@tanstack/react-router";
import { useAuthStore } from "@/stores/auth.store";
import { navConfig } from "@/config/navigation";
import type { NavItem } from "@/config/navigation/types";

export interface NavigationItem extends NavItem {
  isActive: boolean;
}

export function useRoleNavigation(): {
  items: NavigationItem[];
  role: string | null;
  isLoading: boolean;
} {
  const role = useAuthStore((s) => s.user?.role);
  const matchRoute = useMatchRoute();

  if (!role) {
    return { items: [], role: null, isLoading: true };
  }

  const raw = navConfig[role] ?? [];
  const items: NavigationItem[] = raw.map((item) => ({
    ...item,
    isActive: Boolean(matchRoute({ to: item.href, fuzzy: item.href !== "/" })),
  }));

  return { items, role, isLoading: false };
}
