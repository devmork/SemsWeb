// src/features/evaluation-session/taking/hooks/useEvaluations.ts
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { evaluationService } from "../services/evaluationService";
import type { SubmitEvaluationPayload } from "../types";

export const evaluationKeys = {
  all: ["student", "evaluations"] as const,
  teachers: () => [...evaluationKeys.all, "teachers"] as const,
  facilities: () => [...evaluationKeys.all, "facilities"] as const,
  detail: (id: number) => [...evaluationKeys.all, "detail", id] as const,
};

export function useTeacherEvaluations() {
  return useQuery({
    queryKey: evaluationKeys.teachers(),
    queryFn: evaluationService.getTeacherEvaluations,
  });
}

export function useFacilityEvaluations() {
  return useQuery({
    queryKey: evaluationKeys.facilities(),
    queryFn: evaluationService.getFacilityEvaluations,
  });
}

export function useEvaluationDetail(id: number) {
  return useQuery({
    queryKey: evaluationKeys.detail(id),
    queryFn: () => evaluationService.getEvaluationDetail(id),
    enabled: id > 0,
  });
}

export function useSubmitEvaluation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: number;
      payload: SubmitEvaluationPayload;
    }) => evaluationService.submitEvaluation(id, payload),
    onSuccess: (_, variables) => {
      // 1. Invalidate the detail view (though we are navigating away anyway)
      queryClient.invalidateQueries({
        queryKey: evaluationKeys.detail(variables.id),
      });
      // 2. Invalidate the lists so the "Start Evaluation" button updates to "Submitted"
      queryClient.invalidateQueries({ queryKey: evaluationKeys.teachers() });
      queryClient.invalidateQueries({ queryKey: evaluationKeys.facilities() });
    },
  });
}
