import { useQuery } from "@tanstack/react-query";
import { evaluationService } from "../service/evaluationService";
import type { EvaluationAssignment, EvaluationType } from "../types";

export const myEvaluationsKeys = {
  all: ["student", "evaluations"] as const,
  list: () => [...myEvaluationsKeys.all, "list"] as const,
  detail: (id: number) => [...myEvaluationsKeys.all, "detail", id] as const,
};

export function useMyEvaluations(type: EvaluationType) {
  return useQuery<EvaluationAssignment[]>({
    queryKey: ["student", "evaluations", type],
    queryFn: () => evaluationService.getMyEvaluations(type),
  });
}

export function useMyEvaluation(id: number) {
  return useQuery<EvaluationAssignment>({
    queryKey: myEvaluationsKeys.detail(id),
    queryFn: () => evaluationService.getMyEvaluation(id),
  });
}
