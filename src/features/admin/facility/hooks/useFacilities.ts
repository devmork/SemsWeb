import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  facilityService,
  type GetFacilitiesParams,
} from "../services/facilityService";
import type { Facility, CreateFacilityInput, UpdateFacilityInput } from "../types";

export const facilityKeys = {
  all: ["facilities"] as const,
  lists: () => [...facilityKeys.all, "list"] as const,
  list: (params?: GetFacilitiesParams) =>
    [...facilityKeys.lists(), params?.search, params?.isActive] as const,
  detail: (facilityId: number) =>
    [...facilityKeys.all, "detail", facilityId] as const,
};

export function useFacilities(params?: GetFacilitiesParams) {
  return useQuery({
    queryKey: facilityKeys.list(params),
    queryFn: () => facilityService.getFacilities(params),
  });
}

type Context = { previous: [readonly unknown[], Facility[] | undefined][] };

export function useCreateFacility() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateFacilityInput) =>
      facilityService.createFacility(input),
    onMutate: async (input) => {
      await queryClient.cancelQueries({ queryKey: facilityKeys.all });
      const previous = queryClient.getQueriesData<Facility[]>({
        queryKey: facilityKeys.lists(),
      });
      const optimistic: Facility = {
        facilityId: -Date.now(),
        facilityName: input.facilityName,
        description: input.description ?? null,
        location: input.location ?? null,
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        evaluationCount: 0,
      };
      queryClient.setQueriesData<Facility[]>(
        { queryKey: facilityKeys.lists() },
        (old = []) => [...old, optimistic],
      );
      return { previous } satisfies Context;
    },
    onError: (_err, _input, ctx) =>
      ctx?.previous.forEach(([key, data]) =>
        queryClient.setQueryData(key, data),
      ),
    onSettled: () =>
      queryClient.invalidateQueries({ queryKey: facilityKeys.all }),
  });
}

export function useUpdateFacility() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: UpdateFacilityInput) =>
      facilityService.updateFacility(input),
    onMutate: async (input) => {
      await queryClient.cancelQueries({ queryKey: facilityKeys.all });
      const previous = queryClient.getQueriesData<Facility[]>({
        queryKey: facilityKeys.lists(),
      });
      queryClient.setQueriesData<Facility[]>(
        { queryKey: facilityKeys.lists() },
        (old = []) =>
          old.map((f) =>
            f.facilityId === input.facilityId
              ? {
                  ...f,
                  facilityName: input.facilityName,
                  description:
                    input.description !== undefined
                      ? input.description ?? null
                      : f.description,
                  location:
                    input.location !== undefined
                      ? input.location ?? null
                      : f.location,
                  isActive: input.isActive ?? f.isActive,
                }
              : f,
          ),
      );
      return { previous } satisfies Context;
    },
    onError: (_err, _input, ctx) =>
      ctx?.previous.forEach(([key, data]) =>
        queryClient.setQueryData(key, data),
      ),
    onSettled: () =>
      queryClient.invalidateQueries({ queryKey: facilityKeys.all }),
  });
}

export function useDeleteFacility() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (facilityId: number) =>
      facilityService.deleteFacility(facilityId),
    onMutate: async (facilityId) => {
      await queryClient.cancelQueries({ queryKey: facilityKeys.all });
      const previous = queryClient.getQueriesData<Facility[]>({
        queryKey: facilityKeys.lists(),
      });
      queryClient.setQueriesData<Facility[]>(
        { queryKey: facilityKeys.lists() },
        (old = []) => old.filter((f) => f.facilityId !== facilityId),
      );
      return { previous } satisfies Context;
    },
    onError: (_err, _facilityId, ctx) =>
      ctx?.previous.forEach(([key, data]) =>
        queryClient.setQueryData(key, data),
      ),
    onSettled: () =>
      queryClient.invalidateQueries({ queryKey: facilityKeys.all }),
  });
}
