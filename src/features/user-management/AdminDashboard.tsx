import { useUsers } from "./hooks/useUsers";
import { UserRoleTable } from "./components/UserRoleTable";

export function AdminDashboard() {
  const { data: users, isPending, isError, error } = useUsers();

  return (
    <div className="min-h-svh bg-canvas-soft p-6 md:p-10">
      <div className="mx-auto max-w-4xl">
        <h1 className="text-[26px] font-bold tracking-tight">
          Role Management
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          New accounts start as Student on first sign-in. Promote users to Admin
          or SuperAdmin here.
        </p>

        <div className="mt-6">
          {isPending && (
            <p className="text-sm text-muted-foreground">Loading users…</p>
          )}
          {isError && (
            <p className="text-sm text-destructive">
              {error instanceof Error ? error.message : "Failed to load users"}
            </p>
          )}
          {users && <UserRoleTable users={users} />}
        </div>
      </div>
    </div>
  );
}
