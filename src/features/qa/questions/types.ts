export interface Question {
  id: number;
  categoryId: number;
  text: string;
}

export interface CreateQuestionInput {
  text: string;
}

export interface UpdateQuestionInput {
  text?: string;
}
