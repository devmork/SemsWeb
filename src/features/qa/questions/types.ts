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
