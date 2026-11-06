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
