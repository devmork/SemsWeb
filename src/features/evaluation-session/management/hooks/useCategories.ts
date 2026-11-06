import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { categoryService } from "../service/categoryService";
import type {
  Category,
  CreateCategoryInput,
  UpdateCategoryInput,
} from "../types";

export const categoryKeys = {
  all: ["categories"] as const,
  list: () => [...categoryKeys.all, "list"] as const,
};

export function useCategories() {
  return useQuery({
    queryKey: categoryKeys.list(),
    queryFn: categoryService.getCategories,
  });
}

type Context = { previous: Category[] | undefined };

function snapshot(queryClient: ReturnType<typeof useQueryClient>) {
  return queryClient.getQueryData<Category[]>(categoryKeys.list());
}

function rollback(
  queryClient: ReturnType<typeof useQueryClient>,
  ctx: Context | undefined,
) {
  if (ctx?.previous) {
    queryClient.setQueryData(categoryKeys.list(), ctx.previous);
  }
}

export function useCreateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateCategoryInput) =>
      categoryService.createCategory(input),
    onMutate: async (input) => {
      await queryClient.cancelQueries({ queryKey: categoryKeys.list() });
      const previous = snapshot(queryClient);
      const optimistic: Category = {
        id: -Date.now(),
        name: input.name,
        weightPercentage: input.weightPercentage,
        questionCount: 0,
        createdAt: new Date().toISOString(),
      };
      queryClient.setQueryData<Category[]>(categoryKeys.list(), (old = []) => [
        ...old,
        optimistic,
      ]);
      return { previous } satisfies Context;
    },
    onError: (_err, _input, ctx) => rollback(queryClient, ctx),
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: categoryKeys.all });
    },
  });
}

export function useUpdateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, input }: { id: number; input: UpdateCategoryInput }) =>
      categoryService.updateCategory(id, input),
    onMutate: async ({ id, input }) => {
      await queryClient.cancelQueries({ queryKey: categoryKeys.list() });
      const previous = snapshot(queryClient);
      queryClient.setQueryData<Category[]>(categoryKeys.list(), (old = []) =>
        old.map((c) =>
          c.id === id
            ? {
                ...c,
                name: input.name ?? c.name,
                weightPercentage: input.weightPercentage ?? c.weightPercentage,
              }
            : c,
        ),
      );
      return { previous } satisfies Context;
    },
    onError: (_err, _input, ctx) => rollback(queryClient, ctx),
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: categoryKeys.all });
    },
  });
}

export function useDeleteCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => categoryService.deleteCategory(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: categoryKeys.list() });
      const previous = snapshot(queryClient);
      queryClient.setQueryData<Category[]>(categoryKeys.list(), (old = []) =>
        old.filter((c) => c.id !== id),
      );
      return { previous } satisfies Context;
    },
    onError: (_err, _id, ctx) => rollback(queryClient, ctx),
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: categoryKeys.all });
    },
  });
}
