import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { UserRole } from "@/shared/types/user";
import type { ManagedUser } from "../types";
import { userService } from "../services/userService";
import { usersQueryKey } from "./useUsers";

interface UpdateRoleInput {
  userId: number;
  role: UserRole;
}

export function useUpdateUserRole() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, role }: UpdateRoleInput) =>
      userService.updateUserRole(userId, role),

    // optimistic update: flip the role in the cached list immediately
    onMutate: async ({ userId, role }) => {
      await queryClient.cancelQueries({ queryKey: usersQueryKey });
      const previousUsers =
        queryClient.getQueryData<ManagedUser[]>(usersQueryKey);

      queryClient.setQueryData<ManagedUser[]>(usersQueryKey, (old) =>
        old?.map((u) => (u.userId === userId ? { ...u, role } : u)),
      );

      return { previousUsers };
    },

    // roll back to the snapshot if the request fails
    onError: (_err, _vars, context) => {
      if (context?.previousUsers) {
        queryClient.setQueryData(usersQueryKey, context.previousUsers);
      }
    },

    // re-sync with the server regardless of outcome
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: usersQueryKey });
    },
  });
}
