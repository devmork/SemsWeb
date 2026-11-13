import { api } from "@/shared/api/client";
import type {
  CategoryOption,
  CreateFormInput,
  EvaluationType,
  Form,
  FormDetail,
  QuestionOption,
  UpdateFormInput,
} from "../types";

type Envelope<T> = { message: string; data: T };

export const formService = {
  async getForms(): Promise<Form[]> {
    const { data } = await api.get<Form[]>("/api/evaluation/forms");
    return data;
  },

  async getForm(id: number): Promise<FormDetail> {
    const { data } = await api.get<FormDetail>(`/api/evaluation/forms/${id}`);
    return data;
  },

  async createForm(input: CreateFormInput): Promise<Form> {
    const { data } = await api.post<Envelope<Form>>(
      "/api/evaluation/forms",
      input,
    );
    return data.data;
  },

  async updateForm(id: number, input: UpdateFormInput): Promise<Form> {
    const { data } = await api.put<Envelope<Form>>(
      `/api/evaluation/forms/${id}`,
      input,
    );
    return data.data;
  },

  async deleteForm(id: number): Promise<void> {
    await api.delete(`/api/evaluation/forms/${id}`);
  },

  async getEvaluationTypes(): Promise<EvaluationType[]> {
    const { data } = await api.get<EvaluationType[]>("/api/evaluation/types");
    return data;
  },

  async getCategoriesByType(
    evaluationTypeId: number,
  ): Promise<CategoryOption[]> {
    const { data } = await api.get<CategoryOption[]>(
      "/api/evaluation/categories",
      { params: { evaluationTypeId } },
    );
    return data;
  },

  async getQuestions(catNo: number): Promise<QuestionOption[]> {
    const { data } = await api.get<QuestionOption[]>(
      `/api/evaluation/categories/${catNo}/questions`,
    );
    return data;
  },
};
