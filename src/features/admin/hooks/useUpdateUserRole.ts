import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { UserRole } from "@/features/auth";
import type { ManagedUser } from "../types";
import { usersQueryKey } from "./useUsers";

interface UpdateRoleInput {
  userId: number;
  role: UserRole;
}

export function useUpdateUserRole() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, role }: UpdateRoleInput) =>
      api.post(`/superadmin/users/${userId}/role`, { role }),

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
