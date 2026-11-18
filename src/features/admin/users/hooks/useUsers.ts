import { useQuery } from "@tanstack/react-query";
import { userService, type GetUsersParams } from "../services/userService";

export const usersQueryKey = ["users"] as const;

export function useUsers(params?: GetUsersParams) {
  return useQuery({
    queryKey: [...usersQueryKey, params?.search, params?.role],
    queryFn: () => userService.getUsers(params),
  });
}
