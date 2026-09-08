import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { ManagedUser } from "../types";
import type { UserRole } from "@/features/auth";
import { RoleBadge } from "./RoleBadge";
import { useUpdateUserRole } from "../hooks/useUpdateUserRole";

const ROLE_OPTIONS: UserRole[] = ["Student", "QA", "Admin"];

export function UserRoleTable({ users }: { users: ManagedUser[] }) {
  const { mutate: updateRole, isPending } = useUpdateUserRole();

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
              Current role
            </th>
            <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Change role
            </th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.userId} className="border-t border-hairline">
              <td className="px-4 py-3 text-sm">{user.fullName}</td>
              <td className="px-4 py-3 text-sm text-muted-foreground">
                {user.email}
              </td>
              <td className="px-4 py-3">
                <RoleBadge role={user.role} />
              </td>
              <td className="px-4 py-3">
                <Select
                  value={user.role}
                  disabled={isPending}
                  onValueChange={(value) =>
                    updateRole({ userId: user.userId, role: value as UserRole })
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
          ))}
        </tbody>
      </table>
    </div>
  );
}
