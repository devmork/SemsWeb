import { api } from "@/lib/api";
import type { EvaluationAssignment } from "../types";

// Adjust the paths to match the backend controller.
const BASE = "/api/evaluation/my-evaluations";

export const evaluationService = {
  async getMyEvaluations(): Promise<EvaluationAssignment[]> {
    const { data } = await api.get<EvaluationAssignment[]>(BASE);
    return data;
  },

  async getMyEvaluation(id: number): Promise<EvaluationAssignment> {
    const { data } = await api.get<EvaluationAssignment>(`${BASE}/${id}`);
    return data;
  },
};
