import { cn } from "@/shared/lib/utils";
import type { UserRole } from "@/shared/types/user";

/**
 * DESIGN.md `badge-pill`: rounded-pill, caption (13px / 500), token colors only.
 * admin = near-black primary (the signature action color), qa = brand-accent
 * tint, student = neutral surface. No hardcoded hex.
 */
const ROLE_STYLES: Record<UserRole, string> = {
  admin: "bg-primary text-primary-foreground",
  qa: "bg-brand-accent/10 text-brand-accent",
  student: "bg-muted text-muted-foreground",
};

export function RoleBadge({ role }: { role: UserRole }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize",
        ROLE_STYLES[role],
      )}>
      {role}
    </span>
  );
}
