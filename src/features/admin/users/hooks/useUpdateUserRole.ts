import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { UserRole } from "@/shared/types/user";
import type { ManagedUser } from "../types";
import { userService } from "../services/userService";
import { usersQueryKey } from "./useUsers";

interface UpdateUserRolesInput {
  userId: number;
  roles: UserRole[];
}

export function useUpdateUserRoles() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, roles }: UpdateUserRolesInput) =>
      userService.updateUserRoles(userId, roles),

    onMutate: async ({ userId, roles }) => {
      await queryClient.cancelQueries({ queryKey: usersQueryKey });
      const previous = queryClient.getQueriesData<ManagedUser[]>({
        queryKey: usersQueryKey,
      });

      queryClient.setQueriesData<ManagedUser[]>(
        { queryKey: usersQueryKey },
        (old) => old?.map((u) => (u.id === userId ? { ...u, roles } : u)),
      );

      return { previous };
    },

    onError: (_err, _vars, context) => {
      context?.previous.forEach(([key, data]) => {
        queryClient.setQueryData(key, data);
      });
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: usersQueryKey });
    },
  });
}
