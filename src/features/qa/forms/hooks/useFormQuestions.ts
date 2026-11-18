import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { formQuestionService } from "../services/formQuestionService";
import type {
  CreateFormQuestionInput,
  UpdateFormQuestionInput,
} from "../types";

export const formQuestionKeys = {
  all: ["form-questions"] as const,
  list: (formId: number, categoryId: number) =>
    [...formQuestionKeys.all, "list", formId, categoryId] as const,
};

export function useFormQuestions(formId: number, categoryId: number) {
  return useQuery({
    queryKey: formQuestionKeys.list(formId, categoryId),
    queryFn: () => formQuestionService.getQuestions(formId, categoryId),
    enabled: formId > 0 && categoryId > 0,
  });
}

export function useCreateFormQuestion() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      formId,
      categoryId,
      input,
    }: {
      formId: number;
      categoryId: number;
      input: CreateFormQuestionInput;
    }) => formQuestionService.createQuestion(formId, categoryId, input),
    onSettled: (_data, _err, vars) =>
      queryClient.invalidateQueries({
        queryKey: formQuestionKeys.list(vars.formId, vars.categoryId),
      }),
  });
}

export function useUpdateFormQuestion() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      formId,
      categoryId,
      questionId,
      input,
    }: {
      formId: number;
      categoryId: number;
      questionId: number;
      input: UpdateFormQuestionInput;
    }) => formQuestionService.updateQuestion(formId, categoryId, questionId, input),
    onSettled: (_data, _err, vars) =>
      queryClient.invalidateQueries({
        queryKey: formQuestionKeys.list(vars.formId, vars.categoryId),
      }),
  });
}

export function useDeleteFormQuestion() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      formId,
      categoryId,
      questionId,
    }: {
      formId: number;
      categoryId: number;
      questionId: number;
    }) => formQuestionService.deleteQuestion(formId, categoryId, questionId),
    onSettled: (_data, _err, vars) =>
      queryClient.invalidateQueries({
        queryKey: formQuestionKeys.list(vars.formId, vars.categoryId),
      }),
  });
}
