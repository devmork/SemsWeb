import { api } from "@/shared/api/client";
import type {
  FormQuestion,
  CreateFormQuestionInput,
  UpdateFormQuestionInput,
} from "../types";

type FormQuestionDto = {
  formQuestionId: number;
  formCategoryId: number;
  questionName: string | null;
  displayOrder: number;
  points: number | null;
};

type Envelope<T> = { message: string; data: T };

function toFormQuestion(dto: FormQuestionDto): FormQuestion {
  return {
    formQuestionId: dto.formQuestionId,
    formCategoryId: dto.formCategoryId,
    questionName: dto.questionName,
    displayOrder: dto.displayOrder,
    points: dto.points,
  };
}

export const formQuestionService = {
  async getQuestions(
    formId: number,
    categoryId: number,
  ): Promise<FormQuestion[]> {
    const { data } = await api.get<FormQuestionDto[]>(
      `/api/evaluation/forms/${formId}/categories/${categoryId}/questions`,
    );
    if (!Array.isArray(data)) return [];
    return data.map(toFormQuestion);
  },

  async getQuestion(
    formId: number,
    categoryId: number,
    questionId: number,
  ): Promise<FormQuestion> {
    const { data } = await api.get<FormQuestionDto>(
      `/api/evaluation/forms/${formId}/categories/${categoryId}/questions/${questionId}`,
    );
    return toFormQuestion(data);
  },

  async createQuestion(
    formId: number,
    categoryId: number,
    input: CreateFormQuestionInput,
  ): Promise<FormQuestion> {
    const { data } = await api.post<Envelope<FormQuestionDto>>(
      `/api/evaluation/forms/${formId}/categories/${categoryId}/questions`,
      {
        questionName: input.questionName,
        displayOrder: input.displayOrder,
        points: input.points,
      },
    );
    return toFormQuestion(data.data);
  },

  async updateQuestion(
    formId: number,
    categoryId: number,
    questionId: number,
    input: UpdateFormQuestionInput,
  ): Promise<FormQuestion> {
    const { data } = await api.put<Envelope<FormQuestionDto>>(
      `/api/evaluation/forms/${formId}/categories/${categoryId}/questions/${questionId}`,
      {
        questionName: input.questionName,
        displayOrder: input.displayOrder,
        points: input.points,
      },
    );
    return toFormQuestion(data.data);
  },

  async deleteQuestion(
    formId: number,
    categoryId: number,
    questionId: number,
  ): Promise<void> {
    await api.delete(
      `/api/evaluation/forms/${formId}/categories/${categoryId}/questions/${questionId}`,
    );
  },
};
