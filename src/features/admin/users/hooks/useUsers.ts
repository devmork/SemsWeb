import { useQuery } from "@tanstack/react-query";
import { userService } from "../services/userService";

export const usersQueryKey = ["superadmin", "users"] as const;

export function useUsers() {
  return useQuery({
    queryKey: usersQueryKey,
    queryFn: userService.getUsers,
  });
}
