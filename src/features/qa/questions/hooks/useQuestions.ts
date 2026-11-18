import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { questionService } from "../services/questionService";
import type {
  CreateQuestionInput,
  Question,
  UpdateQuestionInput,
} from "../types";

export const questionKeys = {
  all: ["questions"] as const,
  list: (categoryId: number) => [...questionKeys.all, categoryId, "list"] as const,
};

export function useQuestions(categoryId: number) {
  return useQuery({
    queryKey: questionKeys.list(categoryId),
    queryFn: () => questionService.getQuestions(categoryId),
    enabled: categoryId > 0,
  });
}

type Context = { previous: Question[] | undefined };

function snapshot(
  queryClient: ReturnType<typeof useQueryClient>,
  categoryId: number,
) {
  return queryClient.getQueryData<Question[]>(questionKeys.list(categoryId));
}

function rollback(
  queryClient: ReturnType<typeof useQueryClient>,
  categoryId: number,
  ctx: Context | undefined,
) {
  if (ctx?.previous) {
    queryClient.setQueryData(questionKeys.list(categoryId), ctx.previous);
  }
}

export function useCreateQuestion(categoryId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateQuestionInput) =>
      questionService.createQuestion(categoryId, input),
    onMutate: async (input) => {
      await queryClient.cancelQueries({ queryKey: questionKeys.list(categoryId) });
      const previous = snapshot(queryClient, categoryId);
      const optimistic: Question = {
        id: -Date.now(),
        categoryId,
        text: input.text,
      };
      queryClient.setQueryData<Question[]>(questionKeys.list(categoryId), (old = []) => [
        ...old,
        optimistic,
      ]);
      return { previous } satisfies Context;
    },
    onError: (_err, _input, ctx) => rollback(queryClient, categoryId, ctx),
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: questionKeys.all });
    },
  });
}

export function useUpdateQuestion(categoryId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ questionId, input }: { questionId: number; input: UpdateQuestionInput }) =>
      questionService.updateQuestion(categoryId, questionId, input),
    onMutate: async ({ questionId, input }) => {
      await queryClient.cancelQueries({ queryKey: questionKeys.list(categoryId) });
      const previous = snapshot(queryClient, categoryId);
      queryClient.setQueryData<Question[]>(questionKeys.list(categoryId), (old = []) =>
        old.map((q) =>
          q.id === questionId ? { ...q, text: input.text ?? q.text } : q,
        ),
      );
      return { previous } satisfies Context;
    },
    onError: (_err, _input, ctx) => rollback(queryClient, categoryId, ctx),
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: questionKeys.all });
    },
  });
}

export function useDeleteQuestion(categoryId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (questionId: number) => questionService.deleteQuestion(categoryId, questionId),
    onMutate: async (questionId) => {
      await queryClient.cancelQueries({ queryKey: questionKeys.list(categoryId) });
      const previous = snapshot(queryClient, categoryId);
      queryClient.setQueryData<Question[]>(questionKeys.list(categoryId), (old = []) =>
        old.filter((q) => q.id !== questionId),
      );
      return { previous } satisfies Context;
    },
    onError: (_err, _questionId, ctx) => rollback(queryClient, categoryId, ctx),
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: questionKeys.all });
    },
  });
}
