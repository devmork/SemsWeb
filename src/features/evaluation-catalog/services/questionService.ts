import { api } from "@/shared/api/client";
import type {
  CreateQuestionInput,
  Question,
  UpdateQuestionInput,
} from "../types";

type QuestionDto = { QnNo: number; QnName: string };
type QuestionCreated = { message: string; data: QuestionDto };

export const questionService = {
  async getQuestions(catNo: number): Promise<Question[]> {
    const { data } = await api.get<QuestionDto[]>(
      `/api/evaluation/categories/${catNo}/questions`,
    );
    return data.map((q) => ({ id: q.QnNo, catNo, text: q.QnName }));
  },

  async createQuestion(
    catNo: number,
    input: CreateQuestionInput,
  ): Promise<Question> {
    const { data } = await api.post<QuestionCreated>(
      `/api/evaluation/categories/${catNo}/questions`,
      { QnName: input.text },
    );
    return { id: data.data.QnNo, catNo, text: data.data.QnName };
  },

  async updateQuestion(
    catNo: number,
    qnNo: number,
    input: UpdateQuestionInput,
  ): Promise<Question> {
    const { data } = await api.put<QuestionCreated>(
      `/api/evaluation/categories/${catNo}/questions/${qnNo}`,
      { QnName: input.text },
    );
    return { id: data.data.QnNo, catNo, text: data.data.QnName };
  },

  async deleteQuestion(catNo: number, qnNo: number): Promise<void> {
    await api.delete(
      `/api/evaluation/categories/${catNo}/questions/${qnNo}`,
    );
  },
};
