import { api } from "@/lib/api";
import type {
  Category,
  CreateCategoryInput,
  UpdateCategoryInput,
} from "../types";

export const categoryService = {
  async getCategories(): Promise<Category[]> {
    const { data } = await api.get<Category[]>("/api/categories");
    return data;
  },

  async createCategory(input: CreateCategoryInput): Promise<Category> {
    const { data } = await api.post<Category>("/api/categories", input);
    return data;
  },

  async updateCategory(
    id: number,
    input: UpdateCategoryInput,
  ): Promise<Category> {
    const { data } = await api.put<Category>(`/api/categories/${id}`, input);
    return data;
  },

  async deleteCategory(id: number): Promise<void> {
    await api.delete(`/api/categories/${id}`);
  },
};
