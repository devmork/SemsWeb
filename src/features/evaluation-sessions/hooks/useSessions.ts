import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { sessionService } from "../services/sessionService";
import type {
  CreateSessionInput,
  Session,
  UpdateSessionInput,
} from "../types";

export const sessionKeys = {
  all: ["sessions"] as const,
  list: () => [...sessionKeys.all, "list"] as const,
  detail: (id: number) => [...sessionKeys.all, "detail", id] as const,
  submissions: (id: number) => [
    ...sessionKeys.all,
    "submissions",
    id,
  ] as const,
};

export function useSessions() {
  return useQuery({
    queryKey: sessionKeys.list(),
    queryFn: sessionService.getSessions,
  });
}

export function useSession(id: number) {
  return useQuery({
    queryKey: sessionKeys.detail(id),
    queryFn: () => sessionService.getSession(id),
    enabled: id > 0,
  });
}

export function useSubmissions(sessionId: number) {
  return useQuery({
    queryKey: sessionKeys.submissions(sessionId),
    queryFn: () => sessionService.getSubmissions(sessionId),
    enabled: sessionId > 0,
  });
}

type Context = { previous: Session[] | undefined };

function snapshot(queryClient: ReturnType<typeof useQueryClient>) {
  return queryClient.getQueryData<Session[]>(sessionKeys.list());
}

function rollback(
  queryClient: ReturnType<typeof useQueryClient>,
  ctx: Context | undefined,
) {
  if (ctx?.previous) {
    queryClient.setQueryData(sessionKeys.list(), ctx.previous);
  }
}

export function useCreateSession() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateSessionInput) =>
      sessionService.createSession(input),
    onMutate: async (input) => {
      await queryClient.cancelQueries({ queryKey: sessionKeys.list() });
      const previous = snapshot(queryClient);
      const optimistic: Session = {
        id: -Date.now(),
        formId: input.formId,
        formCode: "",
        formTitle: "",
        evaluationTypeId: 0,
        evaluationTypeName: "",
        targetType: "",
        programId: 0,
        schoolYear: input.schoolYear,
        term: input.term,
        opensAtUtc: input.opensAtUtc,
        closesAtUtc: input.closesAtUtc,
        status: "Draft",
        notes: input.notes ?? null,
        createdBy: 0,
        createdAtUtc: new Date().toISOString(),
        updatedAtUtc: new Date().toISOString(),
        submissionCount: 0,
        isAvailableNow: false,
      };
      queryClient.setQueryData<Session[]>(sessionKeys.list(), (old = []) => [
        ...old,
        optimistic,
      ]);
      return { previous } satisfies Context;
    },
    onError: (_err, _input, ctx) => rollback(queryClient, ctx),
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: sessionKeys.all });
    },
  });
}

export function useUpdateSession() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, input }: { id: number; input: UpdateSessionInput }) =>
      sessionService.updateSession(id, input),
    onMutate: async ({ id, input }) => {
      await queryClient.cancelQueries({ queryKey: sessionKeys.list() });
      const previous = snapshot(queryClient);
      queryClient.setQueryData<Session[]>(sessionKeys.list(), (old = []) =>
        old.map((s) =>
          s.id === id
            ? {
                ...s,
                status: input.status ?? s.status,
                opensAtUtc:
                  input.opensAtUtc ?? s.opensAtUtc,
                closesAtUtc:
                  input.closesAtUtc ?? s.closesAtUtc,
                notes: input.notes ?? s.notes,
              }
            : s,
        ),
      );
      return { previous } satisfies Context;
    },
    onError: (_err, _input, ctx) => rollback(queryClient, ctx),
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: sessionKeys.all });
    },
  });
}

export function useDeleteSession() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => sessionService.deleteSession(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: sessionKeys.list() });
      const previous = snapshot(queryClient);
      queryClient.setQueryData<Session[]>(sessionKeys.list(), (old = []) =>
        old.filter((s) => s.id !== id),
      );
      return { previous } satisfies Context;
    },
    onError: (_err, _id, ctx) => rollback(queryClient, ctx),
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: sessionKeys.all });
    },
  });
}

export function useOpenSession() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => sessionService.openSession(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: sessionKeys.list() });
      const previous = snapshot(queryClient);
      queryClient.setQueryData<Session[]>(sessionKeys.list(), (old = []) =>
        old.map((s) =>
          s.id === id ? { ...s, status: "Open" } : s,
        ),
      );
      return { previous } satisfies Context;
    },
    onError: (_err, _id, ctx) => rollback(queryClient, ctx),
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: sessionKeys.all });
    },
  });
}

export function useCloseSession() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => sessionService.closeSession(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: sessionKeys.list() });
      const previous = snapshot(queryClient);
      queryClient.setQueryData<Session[]>(sessionKeys.list(), (old = []) =>
        old.map((s) =>
          s.id === id ? { ...s, status: "Closed" } : s,
        ),
      );
      return { previous } satisfies Context;
    },
    onError: (_err, _id, ctx) => rollback(queryClient, ctx),
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: sessionKeys.all });
    },
  });
}
