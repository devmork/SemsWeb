export interface Category {
  categoryId: number;
  evaluationTypeId: number;
  categoryName: string | null;
  categoryRate: number | null;
}

/** The backend validates all three fields on create and update. */
export interface CreateCategoryInput {
  evaluationTypeId: number;
  categoryName: string;
  categoryRate: number;
}

export type UpdateCategoryInput = CreateCategoryInput;

export interface EvaluationTypeOption {
  evaluationTypeId: number;
  evaluationTypeName: string;
}
