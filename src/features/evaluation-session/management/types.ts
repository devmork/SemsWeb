export interface Category {
  id: number;
  name: string;
  weightPercentage: number;
  questionCount: number;
  createdAt: string;
}

export interface CreateCategoryInput {
  name: string;
  weightPercentage: number;
}

export interface UpdateCategoryInput {
  name?: string;
  weightPercentage?: number;
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
