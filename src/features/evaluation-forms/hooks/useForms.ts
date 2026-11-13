import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { formService } from "../services/formService";
import type { CreateFormInput, Form, UpdateFormInput } from "../types";

export const formKeys = {
  all: ["forms"] as const,
  list: () => [...formKeys.all, "list"] as const,
  detail: (id: number) => [...formKeys.all, "detail", id] as const,
  evaluationTypes: () => [...formKeys.all, "evaluationTypes"] as const,
  categoriesByType: (evaluationTypeId: number) =>
    [...formKeys.all, "categoriesByType", evaluationTypeId] as const,
  questions: (catNo: number) => [...formKeys.all, "questions", catNo] as const,
};

export function useForms() {
  return useQuery({
    queryKey: formKeys.list(),
    queryFn: formService.getForms,
  });
}

export function useForm(id: number) {
  return useQuery({
    queryKey: formKeys.detail(id),
    queryFn: () => formService.getForm(id),
    enabled: id > 0,
  });
}

export function useEvaluationTypes() {
  return useQuery({
    queryKey: formKeys.evaluationTypes(),
    queryFn: formService.getEvaluationTypes,
  });
}

export function useCategoriesByType(evaluationTypeId: number) {
  return useQuery({
    queryKey: formKeys.categoriesByType(evaluationTypeId),
    queryFn: () => formService.getCategoriesByType(evaluationTypeId),
    enabled: evaluationTypeId > 0,
  });
}

export function useQuestionsFor(catNo: number) {
  return useQuery({
    queryKey: formKeys.questions(catNo),
    queryFn: () => formService.getQuestions(catNo),
    enabled: catNo > 0,
  });
}

type Context = { previous: Form[] | undefined };

function snapshot(queryClient: ReturnType<typeof useQueryClient>) {
  return queryClient.getQueryData<Form[]>(formKeys.list());
}

function rollback(
  queryClient: ReturnType<typeof useQueryClient>,
  ctx: Context | undefined,
) {
  if (ctx?.previous) {
    queryClient.setQueryData(formKeys.list(), ctx.previous);
  }
}

export function useCreateForm() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateFormInput) => formService.createForm(input),
    onMutate: async (input) => {
      await queryClient.cancelQueries({ queryKey: formKeys.list() });
      const previous = snapshot(queryClient);
      const optimistic: Form = {
        formId: -Date.now(),
        code: input.code,
        gradeBand: input.gradeBand ?? null,
        targetType: input.targetType ?? "SubjectTeacher",
        programId: input.programId,
        evaluationTypeId: input.evaluationTypeId,
        evaluationTypeName: "",
        title: input.title,
        description: input.description ?? null,
        createdBy: "",
        isActive: input.isActive ?? 0,
        createdAt: new Date().toISOString(),
      };
      queryClient.setQueryData<Form[]>(formKeys.list(), (old = []) => [
        ...old,
        optimistic,
      ]);
      return { previous } satisfies Context;
    },
    onError: (_err, _input, ctx) => rollback(queryClient, ctx),
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: formKeys.all });
    },
  });
}

export function useUpdateForm() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, input }: { id: number; input: UpdateFormInput }) =>
      formService.updateForm(id, input),
    onMutate: async ({ id, input }) => {
      await queryClient.cancelQueries({ queryKey: formKeys.list() });
      const previous = snapshot(queryClient);
      queryClient.setQueryData<Form[]>(formKeys.list(), (old = []) =>
        old.map((f) =>
          f.formId === id
            ? {
                ...f,
                code: input.code ?? f.code,
                gradeBand: input.gradeBand ?? f.gradeBand,
                targetType: input.targetType ?? f.targetType,
                programId: input.programId ?? f.programId,
                evaluationTypeId:
                  input.evaluationTypeId ?? f.evaluationTypeId,
                title: input.title ?? f.title,
                description: input.description ?? f.description,
                isActive: input.isActive ?? f.isActive,
              }
            : f,
        ),
      );
      return { previous } satisfies Context;
    },
    onError: (_err, _input, ctx) => rollback(queryClient, ctx),
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: formKeys.all });
    },
  });
}

export function useDeleteForm() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => formService.deleteForm(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: formKeys.list() });
      const previous = snapshot(queryClient);
      queryClient.setQueryData<Form[]>(formKeys.list(), (old = []) =>
        old.filter((f) => f.formId !== id),
      );
      return { previous } satisfies Context;
    },
    onError: (_err, _id, ctx) => rollback(queryClient, ctx),
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: formKeys.all });
    },
  });
}
