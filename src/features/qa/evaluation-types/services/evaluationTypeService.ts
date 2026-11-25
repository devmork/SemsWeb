import { api } from "@/shared/api/client";
import type {
  EvaluationType,
  CreateEvaluationTypeInput,
  UpdateEvaluationTypeInput,
} from "../types";

/** Mirrors `SemsApi.DTO.EvaluationType.GetEvaluationTypeDto`. */
type EvaluationTypeDto = {
  evaluationTypeId: number;
  evaluationTypeName: string;
};

/** `POST`/`PUT /api/evaluation/types` wrap the payload in `{ message, data }`. */
type Envelope = { message: string; data: EvaluationTypeDto };

function toEvaluationType(dto: EvaluationTypeDto): EvaluationType {
  return {
    evaluationTypeId: dto.evaluationTypeId,
    evaluationTypeName: dto.evaluationTypeName,
  };
}

/** Normalizes a plain DTO or a `{ message, data }` envelope. */
function unwrap(payload: EvaluationTypeDto | Envelope): EvaluationTypeDto {
  return "data" in payload ? payload.data : payload;
}

export interface GetEvaluationTypesParams {
  search?: string | undefined;
}

export const evaluationTypeAdminService = {
  /** `GET /api/evaluation/types` — optional `search`. */
  async getEvaluationTypes(
    params?: GetEvaluationTypesParams,
  ): Promise<EvaluationType[]> {
    const { data } = await api.get<unknown>("/api/evaluation/types", {
      params: params?.search ? { search: params.search } : undefined,
    });
    if (!Array.isArray(data)) return [];
    return (data as EvaluationTypeDto[]).map(toEvaluationType);
  },

  async getEvaluationType(id: number): Promise<EvaluationType> {
    const { data } = await api.get<EvaluationTypeDto>(
      `/api/evaluation/types/${id}`,
    );
    return toEvaluationType(data);
  },

  async createEvaluationType(
    input: CreateEvaluationTypeInput,
  ): Promise<EvaluationType> {
    const { data } = await api.post<Envelope>("/api/evaluation/types", input);
    return toEvaluationType(unwrap(data));
  },

  async updateEvaluationType(
    input: UpdateEvaluationTypeInput,
  ): Promise<EvaluationType> {
    const { evaluationTypeId, ...patch } = input;
    const { data } = await api.put<Envelope>(
      `/api/evaluation/types/${evaluationTypeId}`,
      patch,
    );
    return toEvaluationType(unwrap(data));
  },

  async deleteEvaluationType(id: number): Promise<void> {
    await api.delete(`/api/evaluation/types/${id}`);
  },
};
