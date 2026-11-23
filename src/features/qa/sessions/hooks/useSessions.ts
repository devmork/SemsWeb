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
  facilities: () => [...sessionKeys.all, "facilities"] as const,
};

export function useSessions() {
  return useQuery({
    queryKey: sessionKeys.list(),
    queryFn: () => sessionService.getSessions(),
  });
}

export function useSession(id: number) {
  return useQuery({
    queryKey: sessionKeys.detail(id),
    queryFn: () => sessionService.getSession(id),
    enabled: id > 0,
  });
}

export function useSessionFacilities() {
  return useQuery({
    queryKey: sessionKeys.facilities(),
    queryFn: () => sessionService.getSessionFacilities(),
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
        formTitle: "",
        evaluationTypeId: 0,
        evaluationTypeName: "",
        facilityId: input.facilityId ?? null,
        facilityName: null,
        schoolYear: input.schoolYear,
        term: input.term,
        gradeLevelFrom: input.gradeLevelFrom ?? null,
        gradeLevelTo: input.gradeLevelTo ?? null,
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
                  input.opensAtUtc !== undefined
                    ? input.opensAtUtc
                    : s.opensAtUtc,
                closesAtUtc:
                  input.closesAtUtc !== undefined
                    ? input.closesAtUtc
                    : s.closesAtUtc,
                gradeLevelFrom:
                  input.gradeLevelFrom !== undefined
                    ? input.gradeLevelFrom
                    : s.gradeLevelFrom,
                gradeLevelTo:
                  input.gradeLevelTo !== undefined
                    ? input.gradeLevelTo
                    : s.gradeLevelTo,
                notes: input.notes !== undefined ? input.notes : s.notes,
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
