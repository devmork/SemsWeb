import { api } from "@/shared/api/client";
import type {
  CreateQuestionInput,
  Question,
  UpdateQuestionInput,
} from "../types";

/**
 * Mirrors `SemsApi.DTO.EvaluationQuestionDto`.
 * The API serializes camelCase (`questionId`, `questionName`).
 */
type QuestionDto = { questionId: number; questionName: string | null };

/** `POST`/`PUT .../questions` wrap the payload in `{ message, data }`. */
type QuestionEnvelope = { message: string; data: QuestionDto };

function toQuestion(categoryId: number, dto: QuestionDto): Question {
  return { id: dto.questionId, categoryId, text: dto.questionName ?? "" };
}

export const questionService = {
  async getQuestions(categoryId: number): Promise<Question[]> {
    const { data } = await api.get<QuestionDto[]>(
      `/api/evaluation/categories/${categoryId}/questions`,
    );
    return data.map((q) => toQuestion(categoryId, q));
  },

  async createQuestion(
    categoryId: number,
    input: CreateQuestionInput,
  ): Promise<Question> {
    const { data } = await api.post<QuestionEnvelope>(
      `/api/evaluation/categories/${categoryId}/questions`,
      { questionName: input.text },
    );
    return toQuestion(categoryId, data.data);
  },

  async updateQuestion(
    categoryId: number,
    questionId: number,
    input: UpdateQuestionInput,
  ): Promise<Question> {
    const { data } = await api.put<QuestionEnvelope>(
      `/api/evaluation/categories/${categoryId}/questions/${questionId}`,
      { questionName: input.text },
    );
    return toQuestion(categoryId, data.data);
  },

  async deleteQuestion(categoryId: number, questionId: number): Promise<void> {
    await api.delete(`/api/evaluation/categories/${categoryId}/questions/${questionId}`);
  },
};
