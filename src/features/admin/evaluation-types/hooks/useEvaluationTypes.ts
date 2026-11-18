import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  evaluationTypeAdminService,
  type GetEvaluationTypesParams,
} from "../services/evaluationTypeService";
import type {
  EvaluationType,
  CreateEvaluationTypeInput,
  UpdateEvaluationTypeInput,
} from "../types";

export const evaluationTypeKeys = {
  all: ["evaluation-types"] as const,
  lists: () => [...evaluationTypeKeys.all, "list"] as const,
  list: (params?: GetEvaluationTypesParams) =>
    [...evaluationTypeKeys.lists(), params?.search] as const,
  detail: (id: number) => [...evaluationTypeKeys.all, "detail", id] as const,
};

export function useEvaluationTypes(params?: GetEvaluationTypesParams) {
  return useQuery({
    queryKey: evaluationTypeKeys.list(params),
    queryFn: () => evaluationTypeAdminService.getEvaluationTypes(params),
  });
}

type Context = {
  previous: [readonly unknown[], EvaluationType[] | undefined][];
};

export function useCreateEvaluationType() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateEvaluationTypeInput) =>
      evaluationTypeAdminService.createEvaluationType(input),
    onMutate: async (input) => {
      await queryClient.cancelQueries({ queryKey: evaluationTypeKeys.all });
      const previous = queryClient.getQueriesData<EvaluationType[]>({
        queryKey: evaluationTypeKeys.lists(),
      });
      const optimistic: EvaluationType = {
        evaluationTypeId: -Date.now(),
        evaluationTypeName: input.evaluationTypeName,
      };
      queryClient.setQueriesData<EvaluationType[]>(
        { queryKey: evaluationTypeKeys.lists() },
        (old = []) => [...old, optimistic],
      );
      return { previous } satisfies Context;
    },
    onError: (_err, _input, ctx) =>
      ctx?.previous.forEach(([key, data]) => queryClient.setQueryData(key, data)),
    onSettled: () =>
      queryClient.invalidateQueries({ queryKey: evaluationTypeKeys.all }),
  });
}

export function useUpdateEvaluationType() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: UpdateEvaluationTypeInput) =>
      evaluationTypeAdminService.updateEvaluationType(input),
    onMutate: async (input) => {
      await queryClient.cancelQueries({ queryKey: evaluationTypeKeys.all });
      const previous = queryClient.getQueriesData<EvaluationType[]>({
        queryKey: evaluationTypeKeys.lists(),
      });
      queryClient.setQueriesData<EvaluationType[]>(
        { queryKey: evaluationTypeKeys.lists() },
        (old = []) =>
          old.map((t) =>
            t.evaluationTypeId === input.evaluationTypeId
              ? { ...t, evaluationTypeName: input.evaluationTypeName }
              : t,
          ),
      );
      return { previous } satisfies Context;
    },
    onError: (_err, _input, ctx) =>
      ctx?.previous.forEach(([key, data]) => queryClient.setQueryData(key, data)),
    onSettled: () =>
      queryClient.invalidateQueries({ queryKey: evaluationTypeKeys.all }),
  });
}

export function useDeleteEvaluationType() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) =>
      evaluationTypeAdminService.deleteEvaluationType(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: evaluationTypeKeys.all });
      const previous = queryClient.getQueriesData<EvaluationType[]>({
        queryKey: evaluationTypeKeys.lists(),
      });
      queryClient.setQueriesData<EvaluationType[]>(
        { queryKey: evaluationTypeKeys.lists() },
        (old = []) => old.filter((t) => t.evaluationTypeId !== id),
      );
      return { previous } satisfies Context;
    },
    onError: (_err, _id, ctx) =>
      ctx?.previous.forEach(([key, data]) => queryClient.setQueryData(key, data)),
    onSettled: () =>
      queryClient.invalidateQueries({ queryKey: evaluationTypeKeys.all }),
  });
}
