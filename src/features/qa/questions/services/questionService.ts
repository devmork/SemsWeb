import { api } from "@/shared/api/client";
import type {
  CreateQuestionInput,
  Question,
  UpdateQuestionInput,
} from "../types";

/**
 * Mirrors `SemsApi.DTO.EvaluationQuestionDto`.
 * The API serializes camelCase (`qnNo`, `qnName`).
 */
type QuestionDto = { qnNo: number; qnName: string | null };

/** `POST`/`PUT .../questions` wrap the payload in `{ message, data }`. */
type QuestionEnvelope = { message: string; data: QuestionDto };

function toQuestion(catNo: number, dto: QuestionDto): Question {
  return { id: dto.qnNo, catNo, text: dto.qnName ?? "" };
}

export const questionService = {
  async getQuestions(catNo: number): Promise<Question[]> {
    const { data } = await api.get<QuestionDto[]>(
      `/api/evaluation/categories/${catNo}/questions`,
    );
    return data.map((q) => toQuestion(catNo, q));
  },

  async createQuestion(
    catNo: number,
    input: CreateQuestionInput,
  ): Promise<Question> {
    const { data } = await api.post<QuestionEnvelope>(
      `/api/evaluation/categories/${catNo}/questions`,
      { qnName: input.text },
    );
    return toQuestion(catNo, data.data);
  },

  async updateQuestion(
    catNo: number,
    qnNo: number,
    input: UpdateQuestionInput,
  ): Promise<Question> {
    const { data } = await api.put<QuestionEnvelope>(
      `/api/evaluation/categories/${catNo}/questions/${qnNo}`,
      { qnName: input.text },
    );
    return toQuestion(catNo, data.data);
  },

  async deleteQuestion(catNo: number, qnNo: number): Promise<void> {
    await api.delete(`/api/evaluation/categories/${catNo}/questions/${qnNo}`);
  },
};
