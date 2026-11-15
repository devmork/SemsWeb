export interface Category {
  catNo: number;
  evaluationTypeId: number;
  catRn: string | null;
  catName: string | null;
  catRate: number | null;
}

/** The backend validates all four fields on create and update. */
export interface CreateCategoryInput {
  evaluationTypeId: number;
  catRn: string;
  catName: string;
  catRate: number;
}

export type UpdateCategoryInput = CreateCategoryInput;

export interface EvaluationTypeOption {
  evaluationTypeId: number;
  evaluationTypeName: string;
}

export interface Question {
  id: number;
  catNo: number;
  text: string;
}

export interface CreateQuestionInput {
  text: string;
}

export interface UpdateQuestionInput {
  text?: string;
}
