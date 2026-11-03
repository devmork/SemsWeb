// src/features/evaluation-session/taking/hooks/useEvaluations.ts
import { useQuery } from "@tanstack/react-query";
import { evaluationService } from "../service/evaluationService";

export const evaluationKeys = {
  all: ["student", "evaluations"] as const,
  teachers: () => [...evaluationKeys.all, "teachers"] as const,
  facilities: () => [...evaluationKeys.all, "facilities"] as const,
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
