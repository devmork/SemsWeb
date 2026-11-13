export interface Category {
  id: number;
  name: string;
  evaluationTypeId: number;
  catRn: string;
  catName: string;
  catRate: number;
  questionCount: number;
  createdAt: string;
}

export interface CreateCategoryInput {
  evaluationTypeId?: number;
  catRn?: string;
  catName: string;
  catRate: number;
}

export interface UpdateCategoryInput {
  catName?: string;
  catRate?: number;
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
