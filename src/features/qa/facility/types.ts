/** Mirrors `SemsApi.DTO.Facility.FacilityDto` (camelCase on the wire). */
export interface Facility {
  facilityId: number;
  facilityName: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  evaluationCount: number;
}

export interface CreateFacilityInput {
  facilityName: string;
}

export interface UpdateFacilityInput {
  facilityId: number;
  facilityName: string;
  isActive?: boolean | undefined;
}
