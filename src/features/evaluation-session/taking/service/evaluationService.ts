import { api } from "@/lib/api";
import type { EvaluationAssignment, EvaluationType } from "../types";

export const evaluationService = {
  async getMyEvaluations(
    type: EvaluationType,
  ): Promise<EvaluationAssignment[]> {
    const { data } = await api.get<EvaluationAssignment[]>(
      "/api/evaluation/my-evaluations",
      { params: { type } },
    );
    return data;
  },

  async getMyEvaluation(id: number): Promise<EvaluationAssignment> {
    const { data } = await api.get<EvaluationAssignment>(
      `/api/evaluation/my-evaluations/${id}`,
    );
    return data;
  },
};
