import { api } from "@/shared/api/client";
import type {
  Category,
  CreateCategoryInput,
  UpdateCategoryInput,
} from "../types";

export const categoryService = {
  async getCategories(): Promise<Category[]> {
    const { data } = await api.get<Category[]>("/api/evaluation/categories");
    return data;
  },

  async createCategory(input: CreateCategoryInput): Promise<Category> {
    const { data } = await api.post<Category>("/api/evaluation/categories", input);
    return data;
  },

  async updateCategory(
    id: number,
    input: UpdateCategoryInput,
  ): Promise<Category> {
    const { data } = await api.put<Category>(`/api/evaluation/categories/${id}`, input);
    return data;
  },

  async deleteCategory(id: number): Promise<void> {
    await api.delete(`/api/evaluation/categories/${id}`);
  },
};
