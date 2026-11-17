import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { useUsers } from "../hooks/useUsers";
import { UserRoleTable } from "./UserRoleTable";

export function UserManagement() {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(query.trim()), 300);
    return () => clearTimeout(timer);
  }, [query]);

  const { data: users, isPending, isError, error } = useUsers({
    search: debouncedQuery || undefined,
  });

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-lg font-semibold">Users</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage accounts and roles. New accounts start as Student on first
            sign-in.
          </p>
        </div>
        <Input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by name or email..."
          aria-label="Search users"
          className="max-w-xs"
        />
      </div>

      {isPending && (
        <p className="text-sm text-muted-foreground">Loading users…</p>
      )}
      {isError && (
        <p className="text-sm text-destructive">
          {error instanceof Error ? error.message : "Failed to load users"}
        </p>
      )}
      {users && users.length > 0 && <UserRoleTable users={users} />}
      {users && users.length === 0 && (
        <p className="text-sm text-muted-foreground">No users found.</p>
      )}
    </div>
  );
}
