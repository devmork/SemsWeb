import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { categoryService } from "../services/categoryService";
import type {
  Category,
  CreateCategoryInput,
  UpdateCategoryInput,
} from "../types";

export const categoryKeys = {
  all: ["categories"] as const,
  list: () => [...categoryKeys.all, "list"] as const,
};

export function useCategories(evaluationTypeId?: number) {
  return useQuery({
    queryKey: categoryKeys.list(),
    queryFn: () => categoryService.getCategories(evaluationTypeId),
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
        categoryId: -Date.now(),
        evaluationTypeId: input.evaluationTypeId,
        categoryName: input.categoryName,
        categoryRate: input.categoryRate,
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
    mutationFn: ({ categoryId, input }: { categoryId: number; input: UpdateCategoryInput }) =>
      categoryService.updateCategory(categoryId, input),
    onMutate: async ({ categoryId, input }) => {
      await queryClient.cancelQueries({ queryKey: categoryKeys.list() });
      const previous = snapshot(queryClient);
      queryClient.setQueryData<Category[]>(categoryKeys.list(), (old = []) =>
        old.map((c) =>
          c.categoryId === categoryId
            ? {
                ...c,
                evaluationTypeId: input.evaluationTypeId,
                categoryName: input.categoryName,
                categoryRate: input.categoryRate,
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
    mutationFn: (categoryId: number) => categoryService.deleteCategory(categoryId),
    onMutate: async (categoryId) => {
      await queryClient.cancelQueries({ queryKey: categoryKeys.list() });
      const previous = snapshot(queryClient);
      queryClient.setQueryData<Category[]>(categoryKeys.list(), (old = []) =>
        old.filter((c) => c.categoryId !== categoryId),
      );
      return { previous } satisfies Context;
    },
    onError: (_err, _categoryId, ctx) => rollback(queryClient, ctx),
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: categoryKeys.all });
    },
  });
}
