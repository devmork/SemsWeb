import { useMatchRoute } from "@tanstack/react-router";
import { navConfig } from "@/shared/config/navigation";
import type { NavigationSection } from "@/shared/config/navigation/types";
import { useAuthStore } from "@/features/auth";

export function useRoleNavigation(): {
  sections: NavigationSection[];
  role: string | null;
  isLoading: boolean;
} {
  const role = useAuthStore((s) => s.user?.role);
  const matchRoute = useMatchRoute();

  if (!role) {
    return { sections: [], role: null, isLoading: true };
  }

  const raw = navConfig[role] ?? [];
  const sections: NavigationSection[] = raw.map((section) => ({
    label: section.label,
    items: section.items.map((item) => ({
      ...item,
      isActive: Boolean(matchRoute({ to: item.href, fuzzy: item.href !== "/" })),
    })),
  }));

  return { sections, role, isLoading: false };
}
