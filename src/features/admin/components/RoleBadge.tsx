import { cn } from "@/lib/utils";
import type { UserRole } from "@/features/auth";

const ROLE_STYLES: Record<UserRole, string> = {
  Admin: "bg-primary/10 text-primary",
  QA: "bg-secondary text-secondary-foreground",
  Student: "bg-muted text-muted-foreground",
};

export function RoleBadge({ role }: { role: UserRole }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2 py-1 text-xs font-semibold tracking-wide",
        ROLE_STYLES[role],
      )}>
      {role}
    </span>
  );
}
