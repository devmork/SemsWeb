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
        catNo: -Date.now(),
        evaluationTypeId: input.evaluationTypeId,
        catRn: input.catRn,
        catName: input.catName,
        catRate: input.catRate,
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
    mutationFn: ({ catNo, input }: { catNo: number; input: UpdateCategoryInput }) =>
      categoryService.updateCategory(catNo, input),
    onMutate: async ({ catNo, input }) => {
      await queryClient.cancelQueries({ queryKey: categoryKeys.list() });
      const previous = snapshot(queryClient);
      queryClient.setQueryData<Category[]>(categoryKeys.list(), (old = []) =>
        old.map((c) =>
          c.catNo === catNo
            ? {
                ...c,
                evaluationTypeId: input.evaluationTypeId,
                catRn: input.catRn,
                catName: input.catName,
                catRate: input.catRate,
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
    mutationFn: (catNo: number) => categoryService.deleteCategory(catNo),
    onMutate: async (catNo) => {
      await queryClient.cancelQueries({ queryKey: categoryKeys.list() });
      const previous = snapshot(queryClient);
      queryClient.setQueryData<Category[]>(categoryKeys.list(), (old = []) =>
        old.filter((c) => c.catNo !== catNo),
      );
      return { previous } satisfies Context;
    },
    onError: (_err, _catNo, ctx) => rollback(queryClient, ctx),
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: categoryKeys.all });
    },
  });
}
