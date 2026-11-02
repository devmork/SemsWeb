import { useQuery } from "@tanstack/react-query";
import { evaluationService } from "../service/evaluationService";
import type { EvaluationAssignment, EvaluationType } from "../types";

export const myEvaluationsKeys = {
  all: ["student", "evaluations"] as const,
  list: (type: EvaluationType) =>
    [...myEvaluationsKeys.all, "list", type] as const,
  detail: (id: number) => [...myEvaluationsKeys.all, "detail", id] as const,
};

export function useEvaluations(type: EvaluationType) {
  return useQuery<EvaluationAssignment[]>({
    queryKey: myEvaluationsKeys.list(type), // Use the factory
    queryFn: () => evaluationService.getMyEvaluations(type),
  });
}
export function useEvaluation(id: number) {
  return useQuery<EvaluationAssignment>({
    queryKey: myEvaluationsKeys.detail(id),
    queryFn: () => evaluationService.getMyEvaluation(id),
  });
}
