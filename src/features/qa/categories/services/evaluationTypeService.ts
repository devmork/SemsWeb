import { api } from "@/shared/api/client";
import type { EvaluationTypeOption } from "../types";

/** Mirrors `SemsApi.DTO.EvaluationType.EvaluationTypeResponseDto`. */
type EvaluationTypeDto = {
  evaluationTypeId: number;
  evaluationTypeName: string;
};

export const evaluationTypeService = {
  async getEvaluationTypes(): Promise<EvaluationTypeOption[]> {
    const { data } = await api.get<EvaluationTypeDto[]>("/api/evaluation/types");
    return data.map((t) => ({
      evaluationTypeId: t.evaluationTypeId,
      evaluationTypeName: t.evaluationTypeName,
    }));
  },
};
