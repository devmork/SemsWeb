import { Link, useLocation } from "@tanstack/react-router";
import { useAuthStore } from "@/stores/auth.store";
import { navConfig } from "@/config/nav-config";
import { cn } from "@/lib/utils";

export function AppSidebar() {
  const role = useAuthStore((s) => s.user?.role);
  const location = useLocation();
  const items = role ? navConfig[role] : [];

  return (
    <aside className="w-64 shrink-0 border-r bg-background h-screen sticky top-0 flex flex-col">
      <div className="h-14 flex items-center px-4 font-semibold">SEMS</div>
      <nav className="flex-1 px-2 space-y-1">
        {items.map((item) => {
          const active = location.pathname === item.href;
          return (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm",
                active ? "bg-muted font-medium" : "hover:bg-muted/50",
              )}>
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
