import { api } from "@/shared/api/client";
import type {
  FormCategory,
  CreateFormCategoryInput,
  UpdateFormCategoryInput,
} from "../types";

type FormCategoryDto = {
  formCategoryId: number;
  formId: number;
  categoryId: number;
  categoryName: string | null;
  categoryRate: number | null;
  isActive: boolean;
  displayOrder: number;
};

type Envelope<T> = { message: string; data: T };

function toFormCategory(dto: FormCategoryDto): FormCategory {
  return {
    formCategoryId: dto.formCategoryId,
    formId: dto.formId,
    categoryId: dto.categoryId,
    categoryName: dto.categoryName,
    categoryRate: dto.categoryRate,
    isActive: dto.isActive,
    displayOrder: dto.displayOrder,
  };
}

export const formCategoryService = {
  async getFormCategories(
    formId: number,
    isActive?: boolean,
  ): Promise<FormCategory[]> {
    const { data } = await api.get<FormCategoryDto[]>(
      `/api/evaluation/forms/${formId}/categories`,
      { params: isActive !== undefined ? { isActive } : undefined },
    );
    if (!Array.isArray(data)) return [];
    return data.map(toFormCategory);
  },

  async addFormCategory(input: CreateFormCategoryInput): Promise<FormCategory> {
    const { data } = await api.post<Envelope<FormCategoryDto>>(
      `/api/evaluation/forms/${input.formId}/categories`,
      {
        formId: input.formId,
        categoryId: input.categoryId,
        isActive: input.isActive,
        displayOrder: input.displayOrder,
      },
    );
    return toFormCategory(data.data);
  },

  async updateFormCategory(
    formId: number,
    input: UpdateFormCategoryInput,
  ): Promise<FormCategory> {
    const { formCategoryId, ...patch } = input;
    const { data } = await api.put<Envelope<FormCategoryDto>>(
      `/api/evaluation/forms/${formId}/categories/${formCategoryId}`,
      patch,
    );
    return toFormCategory(data.data);
  },

  async removeFormCategory(formId: number, formCategoryId: number): Promise<void> {
    await api.delete(
      `/api/evaluation/forms/${formId}/categories/${formCategoryId}`,
    );
  },
};
