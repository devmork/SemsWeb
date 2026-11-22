/** Mirrors `SemsApi.DTO.EvaluationType.EvaluationTypeResponseDto`. */
export interface EvaluationType {
  evaluationTypeId: number;
  evaluationTypeName: string;
  /** Facility types are taken against a facility, not a subject/teacher. */
  isFacility: boolean;
}

export interface CreateEvaluationTypeInput {
  evaluationTypeName: string;
  /** Omit on update to keep the existing flag. */
  isFacility?: boolean | undefined;
}

export interface UpdateEvaluationTypeInput extends CreateEvaluationTypeInput {
  evaluationTypeId: number;
}
