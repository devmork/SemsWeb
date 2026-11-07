import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { questionService } from "../service/questionService";
import type {
  CreateQuestionInput,
  Question,
  UpdateQuestionInput,
} from "../types";

export const questionKeys = {
  all: ["questions"] as const,
  list: (catNo: number) => [...questionKeys.all, catNo, "list"] as const,
};

export function useQuestions(catNo: number) {
  return useQuery({
    queryKey: questionKeys.list(catNo),
    queryFn: () => questionService.getQuestions(catNo),
    enabled: catNo > 0,
  });
}

type Context = { previous: Question[] | undefined };

function snapshot(
  queryClient: ReturnType<typeof useQueryClient>,
  catNo: number,
) {
  return queryClient.getQueryData<Question[]>(questionKeys.list(catNo));
}

function rollback(
  queryClient: ReturnType<typeof useQueryClient>,
  catNo: number,
  ctx: Context | undefined,
) {
  if (ctx?.previous) {
    queryClient.setQueryData(questionKeys.list(catNo), ctx.previous);
  }
}

export function useCreateQuestion(catNo: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateQuestionInput) =>
      questionService.createQuestion(catNo, input),
    onMutate: async (input) => {
      await queryClient.cancelQueries({ queryKey: questionKeys.list(catNo) });
      const previous = snapshot(queryClient, catNo);
      const optimistic: Question = {
        id: -Date.now(),
        catNo,
        text: input.text,
      };
      queryClient.setQueryData<Question[]>(questionKeys.list(catNo), (old = []) => [
        ...old,
        optimistic,
      ]);
      return { previous } satisfies Context;
    },
    onError: (_err, _input, ctx) => rollback(queryClient, catNo, ctx),
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: questionKeys.all });
    },
  });
}

export function useUpdateQuestion(catNo: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ qnNo, input }: { qnNo: number; input: UpdateQuestionInput }) =>
      questionService.updateQuestion(catNo, qnNo, input),
    onMutate: async ({ qnNo, input }) => {
      await queryClient.cancelQueries({ queryKey: questionKeys.list(catNo) });
      const previous = snapshot(queryClient, catNo);
      queryClient.setQueryData<Question[]>(questionKeys.list(catNo), (old = []) =>
        old.map((q) =>
          q.id === qnNo ? { ...q, text: input.text ?? q.text } : q,
        ),
      );
      return { previous } satisfies Context;
    },
    onError: (_err, _input, ctx) => rollback(queryClient, catNo, ctx),
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: questionKeys.all });
    },
  });
}

export function useDeleteQuestion(catNo: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (qnNo: number) => questionService.deleteQuestion(catNo, qnNo),
    onMutate: async (qnNo) => {
      await queryClient.cancelQueries({ queryKey: questionKeys.list(catNo) });
      const previous = snapshot(queryClient, catNo);
      queryClient.setQueryData<Question[]>(questionKeys.list(catNo), (old = []) =>
        old.filter((q) => q.id !== qnNo),
      );
      return { previous } satisfies Context;
    },
    onError: (_err, _qnNo, ctx) => rollback(queryClient, catNo, ctx),
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: questionKeys.all });
    },
  });
}
