import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { ManagedUser } from "../types";
import { fullNameOf } from "../types";
import type { UserRole } from "@/shared/types/user";
import { RoleBadge } from "./RoleBadge";
import { useUpdateUserRoles } from "../hooks/useUpdateUserRole";

const ROLE_OPTIONS: UserRole[] = ["student", "qa", "admin"];

export function UserRoleTable({ users }: { users: ManagedUser[] }) {
  const { mutate: updateRoles, isPending } = useUpdateUserRoles();

  return (
    <div className="overflow-hidden rounded-xl border border-hairline">
      <table className="w-full text-left">
        <thead>
          <tr className="bg-canvas-soft">
            <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Name
            </th>
            <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Email
            </th>
            <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Status
            </th>
            <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Current roles
            </th>
            <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Change role
            </th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => {
            const primaryRole =
              ROLE_OPTIONS.find((r) => user.roles.includes(r)) ?? "student";
            return (
              <tr key={user.id} className="border-t border-hairline">
                <td className="px-4 py-3 text-sm">{fullNameOf(user)}</td>
                <td className="px-4 py-3 text-sm text-muted-foreground">
                  {user.email}
                </td>
                <td className="px-4 py-3 text-sm text-muted-foreground">
                  {user.status}
                </td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-1">
                    {user.roles.map((role) => (
                      <RoleBadge key={role} role={role} />
                    ))}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <Select
                    value={primaryRole}
                    disabled={isPending}
                    onValueChange={(value) =>
                      updateRoles({
                        userId: user.id,
                        roles: [value as UserRole],
                      })
                    }>
                    <SelectTrigger className="w-36 rounded-md border-hairline text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {ROLE_OPTIONS.map((role) => (
                        <SelectItem key={role} value={role}>
                          {role}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
