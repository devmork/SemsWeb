import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/shared/lib/utils";
import type { ManagedUser } from "../types";
import { fullNameOf, initialsOf } from "../types";
import type { UserRole } from "@/shared/types/user";
import { RoleBadge } from "./RoleBadge";
import { useUpdateUserRoles } from "../hooks/useUpdateUserRole";

const ROLE_OPTIONS: UserRole[] = ["student", "qa", "admin"];

function StatusPill({ status }: { status: string }) {
  const isActive = status.toLowerCase() === "active";
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium",
        isActive
          ? "bg-success/10 text-success"
          : "bg-muted text-muted-foreground",
      )}>
      <span
        className={cn(
          "size-1.5 rounded-full",
          isActive ? "bg-success" : "bg-muted-foreground",
        )}
        aria-hidden
      />
      {status || "Unknown"}
    </span>
  );
}

export function UserRoleTable({ users }: { users: ManagedUser[] }) {
  const { mutate: updateRoles, isPending } = useUpdateUserRoles();

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
      <table className="w-full text-left">
        <thead>
          <tr className="border-b border-border bg-muted/50">
            <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              User
            </th>
            <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Email
            </th>
            <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Status
            </th>
            <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Roles
            </th>
            <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Change role
            </th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => {
            const primaryRole =
              ROLE_OPTIONS.find((r) => user.roles.includes(r)) ?? "student";
            return (
              <tr
                key={user.id}
                className="border-b border-border last:border-0 transition-colors hover:bg-muted/40">
                <td className="px-5 py-3">
                  <div className="flex items-center gap-3">
                    <Avatar className="size-9">
                      {user.pictureUrl ? (
                        <AvatarImage src={user.pictureUrl} alt="" />
                      ) : null}
                      <AvatarFallback className="text-xs font-medium">
                        {initialsOf(user)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-medium text-foreground">
                      {fullNameOf(user)}
                    </span>
                  </div>
                </td>
                <td className="px-5 py-3 text-sm text-muted-foreground">
                  {user.email}
                </td>
                <td className="px-5 py-3">
                  <StatusPill status={user.status} />
                </td>
                <td className="px-5 py-3">
                  <div className="flex flex-wrap gap-1">
                    {user.roles.map((role) => (
                      <RoleBadge key={role} role={role} />
                    ))}
                  </div>
                </td>
                <td className="px-5 py-3">
                  <div className="flex justify-end">
                    <Select
                      value={primaryRole}
                      disabled={isPending}
                      onValueChange={(value) =>
                        updateRoles({
                          userId: user.id,
                          roles: [value as UserRole],
                        })
                      }>
                      <SelectTrigger className="h-9 w-32 rounded-md border-border text-sm">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {ROLE_OPTIONS.map((role) => (
                          <SelectItem key={role} value={role}>
                            <span className="capitalize">{role}</span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
