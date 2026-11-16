import { api } from "@/shared/api/client";
import type {
  Category,
  CreateCategoryInput,
  UpdateCategoryInput,
} from "../types";

/**
 * Mirrors `SemsApi.DTO.CategoryResponseDto`.
 * The API serializes camelCase, so `catNo`/`catName`/... arrive as-is.
 */
type CategoryDto = {
  catNo: number;
  evaluationTypeId: number;
  catRn: string | null;
  catName: string | null;
  catRate: number | null;
};

/** `POST`/`PUT /api/evaluation/categories` wrap the payload in `{ message, data }`. */
type CategoryEnvelope = { message: string; data: CategoryDto };

function toCategory(dto: CategoryDto): Category {
  return {
    catNo: dto.catNo,
    evaluationTypeId: dto.evaluationTypeId,
    catRn: dto.catRn,
    catName: dto.catName,
    catRate: dto.catRate,
  };
}

export const categoryService = {
  async getCategories(evaluationTypeId?: number): Promise<Category[]> {
    const { data } = await api.get<CategoryDto[]>("/api/evaluation/categories", {
      params: evaluationTypeId ? { evaluationTypeId } : undefined,
    });
    return data.map(toCategory);
  },

  async getCategory(catNo: number): Promise<Category> {
    const { data } = await api.get<CategoryDto>(
      `/api/evaluation/categories/${catNo}`,
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
    catNo: number,
    input: UpdateCategoryInput,
  ): Promise<Category> {
    const { data } = await api.put<CategoryEnvelope>(
      `/api/evaluation/categories/${catNo}`,
      input,
    );
    return toCategory(data.data);
  },

  async deleteCategory(catNo: number): Promise<void> {
    await api.delete(`/api/evaluation/categories/${catNo}`);
  },
};
