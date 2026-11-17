/** Mirrors `SemsApi.DTO.Facility.FacilityDto` (camelCase on the wire). */
export interface Facility {
  facilityId: number;
  facilityName: string;
  description: string | null;
  location: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  evaluationCount: number;
}

export interface CreateFacilityInput {
  facilityName: string;
  description?: string | undefined;
  location?: string | undefined;
}

export interface UpdateFacilityInput {
  facilityId: number;
  facilityName: string;
  description?: string | undefined;
  location?: string | undefined;
  isActive?: boolean | undefined;
}
