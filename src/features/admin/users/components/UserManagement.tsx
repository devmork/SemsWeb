import { useState, useEffect, type ReactNode } from "react";
import { Search, Users as UsersIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useUsers } from "../hooks/useUsers";
import { UserRoleTable } from "./UserRoleTable";

function TableSkeleton() {
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
      <div className="border-b border-border bg-muted/50 px-5 py-3">
        <Skeleton className="h-3 w-24" />
      </div>
      {Array.from({ length: 5 }).map((_, i) => (
        <div
          key={i}
          className="flex items-center gap-4 border-b border-border px-5 py-4 last:border-0">
          <Skeleton className="size-9 shrink-0 rounded-full" />
          <Skeleton className="h-4 flex-1" />
          <Skeleton className="h-4 w-40" />
          <Skeleton className="h-5 w-16 rounded-full" />
          <Skeleton className="h-9 w-32" />
        </div>
      ))}
    </div>
  );
}

function StateCard({
  icon,
  title,
  description,
  tone = "muted",
}: {
  icon: ReactNode;
  title: string;
  description: string;
  tone?: "muted" | "error";
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-border bg-card px-6 py-16 text-center shadow-sm">
      <div
        className={`flex size-12 items-center justify-center rounded-full ${
          tone === "error"
            ? "bg-destructive/10 text-destructive"
            : "bg-muted text-muted-foreground"
        }`}>
        {icon}
      </div>
      <div className="space-y-1">
        <p className="text-base font-semibold text-foreground">{title}</p>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}

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
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            Users
          </h1>
          <p className="text-sm text-muted-foreground">
            Manage accounts and roles. New accounts start as Student on first
            sign-in.
          </p>
        </div>
        <div className="relative w-full sm:max-w-xs">
          <Search
            className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground max-[320px]:hidden"
            aria-hidden
          />
          <Input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name or email…"
            aria-label="Search users"
            className="pl-9 max-[320px]:pl-3"
          />
        </div>
      </header>

      {isPending ? (
        <TableSkeleton />
      ) : isError ? (
        <StateCard
          icon={<UsersIcon className="size-5" />}
          title="Couldn't load users"
          description={
            error instanceof Error
              ? error.message
              : "Check your connection and try again."
          }
          tone="error"
        />
      ) : users && users.length > 0 ? (
        <UserRoleTable users={users} />
      ) : (
        <StateCard
          icon={<UsersIcon className="size-5" />}
          title={debouncedQuery ? "No users found" : "No users yet"}
          description={
            debouncedQuery
              ? "Try a different name or email."
              : "Accounts will appear here once users sign in."
          }
        />
      )}
    </div>
  );
}
