export interface Form {
  formId: number;
  evaluationTypeId: number;
  evaluationTypeName: string;
  title: string;
  description: string | null;
  createdBy: number;
  isActive: 0 | 1;
  createdAt: string;
}

export interface FormDetail extends Form {
  categories: {
    categoryId: number;
    categoryName: string | null;
    categoryRate: number | null;
    questions: { questionId: number; questionName: string | null }[];
  }[];
}

export interface CreateFormInput {
  evaluationTypeId: number;
  title: string;
  description?: string | undefined;
  isActive?: 0 | 1 | undefined;
}

export interface UpdateFormInput {
  evaluationTypeId?: number | undefined;
  title?: string | undefined;
  description?: string | undefined;
  isActive?: 0 | 1 | undefined;
}

export interface EvaluationType {
  evaluationTypeId: number;
  evaluationTypeName: string;
}

export interface CategoryOption {
  categoryId: number;
  evaluationTypeId: number;
  categoryName: string | null;
  categoryRate: number | null;
}

/** Mirrors `SemsApi.DTO.FormCategory.FormCategoryResponseDto`. */
export interface FormCategory {
  formCategoryId: number;
  formId: number;
  categoryId: number;
  categoryName: string | null;
  categoryRate: number | null;
  isActive: boolean;
  displayOrder: number;
}

/** Mirrors `SemsApi.DTO.FormQuestion.FormQuestionResponseDto`. */
export interface FormQuestion {
  formQuestionId: number;
  formCategoryId: number;
  questionName: string | null;
  displayOrder: number;
  points: number | null;
}

export interface CreateFormCategoryInput {
  formId: number;
  categoryId: number;
  isActive?: boolean | undefined;
  displayOrder?: number | undefined;
}

export interface UpdateFormCategoryInput {
  formCategoryId: number;
  categoryId?: number | undefined;
  isActive?: boolean | undefined;
  displayOrder?: number | undefined;
}

export interface CreateFormQuestionInput {
  formCategoryId: number;
  questionName: string;
  displayOrder?: number | undefined;
  points?: number | undefined;
}

export interface UpdateFormQuestionInput {
  formQuestionId: number;
  questionName?: string | undefined;
  displayOrder?: number | undefined;
  points?: number | undefined;
}
