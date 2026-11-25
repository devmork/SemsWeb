import { useQuery } from "@tanstack/react-query";
import { evaluationTypeService } from "../services/evaluationTypeService";

export const evaluationTypeKeys = {
  all: ["evaluation-types"] as const,
  list: () => [...evaluationTypeKeys.all, "list"] as const,
};

export function useEvaluationTypes() {
  return useQuery({
    queryKey: evaluationTypeKeys.list(),
    queryFn: evaluationTypeService.getEvaluationTypes,
  });
}
