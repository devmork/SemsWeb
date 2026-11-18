export { FacilityManagement } from "./components/FacilityManagement";
export { FacilityDialog } from "./components/FacilityDialog";
export { DeleteFacilityDialog } from "./components/DeleteFacilityDialog";

export {
  useFacilities,
  useCreateFacility,
  useUpdateFacility,
  useDeleteFacility,
  facilityKeys,
} from "./hooks/useFacilities";

export { facilityService } from "./services/facilityService";
export type { GetFacilitiesParams } from "./services/facilityService";

export type {
  Facility,
  CreateFacilityInput,
  UpdateFacilityInput,
} from "./types";
