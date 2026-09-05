import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { ManagedUser } from "../types";

export const usersQueryKey = ["superadmin", "users"] as const;

export function useUsers() {
  return useQuery({
    queryKey: usersQueryKey,
    queryFn: () => api.get<ManagedUser[]>("/admin/users"),
  });
}
