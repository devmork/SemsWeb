import { api } from "@/shared/api/client";
import type {
  Category,
  CreateCategoryInput,
  UpdateCategoryInput,
} from "../types";

/**
 * Mirrors `SemsApi.DTO.CategoryResponseDto`.
 * The API serializes camelCase, so `categoryId`/`categoryName`/... arrive as-is.
 */
type CategoryDto = {
  categoryId: number;
  evaluationTypeId: number;
  categoryName: string | null;
  categoryRate: number | null;
};

/** `POST`/`PUT /api/evaluation/categories` wrap the payload in `{ message, data }`. */
type CategoryEnvelope = { message: string; data: CategoryDto };

function toCategory(dto: CategoryDto): Category {
  return {
    categoryId: dto.categoryId,
    evaluationTypeId: dto.evaluationTypeId,
    categoryName: dto.categoryName,
    categoryRate: dto.categoryRate,
  };
}

export const categoryService = {
  async getCategories(evaluationTypeId?: number): Promise<Category[]> {
    const { data } = await api.get<CategoryDto[]>("/api/evaluation/categories", {
      params: evaluationTypeId ? { evaluationTypeId } : undefined,
    });
    return data.map(toCategory);
  },

  async getCategory(categoryId: number): Promise<Category> {
    const { data } = await api.get<CategoryDto>(
      `/api/evaluation/categories/${categoryId}`,
    );
    return toCategory(data);
  },

  async createCategory(input: CreateCategoryInput): Promise<Category> {
    const { data } = await api.post<CategoryEnvelope>(
      "/api/evaluation/categories",
      input,
    );
    return toCategory(data.data);
  },

  async updateCategory(
    categoryId: number,
    input: UpdateCategoryInput,
  ): Promise<Category> {
    const { data } = await api.put<CategoryEnvelope>(
      `/api/evaluation/categories/${categoryId}`,
      input,
    );
    return toCategory(data.data);
  },

  async deleteCategory(categoryId: number): Promise<void> {
    await api.delete(`/api/evaluation/categories/${categoryId}`);
  },
};
