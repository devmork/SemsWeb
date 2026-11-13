import { api } from "@/shared/api/client";
import type {
  TeacherEvaluation,
  FacilityEvaluation,
  EvaluationDetail,
  SubmitEvaluationPayload,
} from "../types";

export const evaluationService = {
  // Separate endpoint for teachers
  async getTeacherEvaluations(): Promise<TeacherEvaluation[]> {
    const { data } = await api.get<TeacherEvaluation[]>(
      "/api/evaluation/my-evaluations/teachers",
    );
    return data;
  },

  // Separate endpoint for facilities
  async getFacilityEvaluations(): Promise<FacilityEvaluation[]> {
    const { data } = await api.get<FacilityEvaluation[]>(
      "/api/evaluation/my-evaluations/facilities",
    );
    return data;
  },

  async getEvaluationDetail(id: number): Promise<EvaluationDetail> {
    const { data } = await api.get<EvaluationDetail>(
      `/api/evaluation/my-evaluations/${id}`,
    );
    return data;
  },

  async submitEvaluation(
    id: number,
    payload: SubmitEvaluationPayload,
  ): Promise<void> {
    await api.post(`/api/evaluation/my-evaluations/${id}/submit`, payload);
  },
};
