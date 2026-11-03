import { api } from "@/lib/api";
import type { TeacherEvaluation, FacilityEvaluation } from "../types";

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

  async getEvaluationDetail(id: number) {
    const { data } = await api.get(`/api/evaluation/my-evaluations/${id}`);
    return data;
  },
};
