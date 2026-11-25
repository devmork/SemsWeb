/** Mirrors `SemsApi.DTO.EvaluationType.GetEvaluationTypeDto`. */
export interface EvaluationType {
  evaluationTypeId: number;
  evaluationTypeName: string;
}

export interface CreateEvaluationTypeInput {
  evaluationTypeName: string;
}

export interface UpdateEvaluationTypeInput extends CreateEvaluationTypeInput {
  evaluationTypeId: number;
}
