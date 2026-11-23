import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ResponsiveTable } from "@/shared/components/ResponsiveTable";
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
    <ResponsiveTable
      ariaLabel="Users and roles"
      minWidth="820px"
      items={users}
      rowKey={(user) => user.id}
      columns={[
        {
          header: "User",
          primary: true,
          cell: (user) => (
            <span className="flex min-w-0 items-center gap-3">
              <Avatar className="size-9 shrink-0">
                {user.pictureUrl ? (
                  <AvatarImage src={user.pictureUrl} alt="" />
                ) : null}
                <AvatarFallback className="text-xs font-medium">
                  {initialsOf(user)}
                </AvatarFallback>
              </Avatar>
              <span className="min-w-0 break-words font-medium text-foreground">
                {fullNameOf(user)}
              </span>
            </span>
          ),
        },
        {
          header: "Email",
          cell: (user) => (
            <span className="break-all text-muted-foreground">
              {user.email}
            </span>
          ),
        },
        {
          header: "Status",
          cell: (user) => <StatusPill status={user.status} />,
        },
        {
          header: "Roles",
          cell: (user) => (
            <span className="flex flex-wrap gap-1">
              {user.roles.map((role) => (
                <RoleBadge key={role} role={role} />
              ))}
            </span>
          ),
        },
        {
          header: "Change role",
          cell: (user) => {
            const primaryRole =
              ROLE_OPTIONS.find((r) => user.roles.includes(r)) ?? "student";
            return (
              <Select
                value={primaryRole}
                disabled={isPending}
                onValueChange={(value) =>
                  updateRoles({
                    userId: user.id,
                    roles: [value as UserRole],
                  })
                }>
                <SelectTrigger className="h-11 w-full rounded-md border-border text-sm sm:h-9 sm:w-32">
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
            );
          },
        },
      ]}
    />
  );
}
