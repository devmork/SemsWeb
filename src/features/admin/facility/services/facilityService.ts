import { api } from "@/shared/api/client";
import type {
  Facility,
  CreateFacilityInput,
  UpdateFacilityInput,
} from "../types";

/** Mirrors `SemsApi.DTO.Facility.FacilityDto`. */
type FacilityDto = {
  facilityId: number;
  facilityName: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  evaluationCount: number;
};

function toFacility(dto: FacilityDto): Facility {
  return {
    facilityId: dto.facilityId,
    facilityName: dto.facilityName,
    isActive: dto.isActive,
    createdAt: dto.createdAt,
    updatedAt: dto.updatedAt,
    evaluationCount: dto.evaluationCount,
  };
}

export interface GetFacilitiesParams {
  search?: string | undefined;
  isActive?: boolean | undefined;
}

export const facilityService = {
  /** `GET /api/facilities` — query params `search` / `isActive` (QA + Admin). */
  async getFacilities(params?: GetFacilitiesParams): Promise<Facility[]> {
    const { data } = await api.get<unknown>("/api/facilities", {
      params: {
        ...(params?.search ? { search: params.search } : {}),
        ...(params?.isActive !== undefined ? { isActive: params.isActive } : {}),
      },
    });
    if (!Array.isArray(data)) return [];
    return (data as FacilityDto[]).map(toFacility);
  },

  async getFacility(facilityId: number): Promise<Facility> {
    const { data } = await api.get<FacilityDto>(
      `/api/facilities/${facilityId}`,
    );
    return toFacility(data);
  },

  /** `POST /api/facilities` — body `{ facilityName }`. */
  async createFacility(input: CreateFacilityInput): Promise<Facility> {
    const { data } = await api.post<FacilityDto>("/api/facilities", {
      facilityName: input.facilityName,
    });
    return toFacility(data);
  },

  /** `PUT /api/facilities/{id}` — body `{ facilityName, isActive? }`. */
  async updateFacility(input: UpdateFacilityInput): Promise<Facility> {
    const { facilityId, ...patch } = input;
    const { data } = await api.put<FacilityDto>(
      `/api/facilities/${facilityId}`,
      patch,
    );
    return toFacility(data);
  },

  async deleteFacility(facilityId: number): Promise<void> {
    await api.delete(`/api/facilities/${facilityId}`);
  },
};
