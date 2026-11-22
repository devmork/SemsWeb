import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { sessionKeys } from "@/features/qa/sessions";
import { reportService } from "../services/reportService";
import type { FacilityResultQuery } from "../types";

export const reportKeys = {
  all: ["facility-reports"] as const,
  summary: (query: FacilityResultQuery) =>
    [...reportKeys.all, "summary", query] as const,
  facility: (facilityId: number, query: FacilityResultQuery) =>
    [...reportKeys.all, "facility", facilityId, query] as const,
  submissions: (sessionId: number) =>
    [...reportKeys.all, "submissions", sessionId] as const,
};

export function useFacilitySummary(query: FacilityResultQuery = {}) {
  return useQuery({
    queryKey: reportKeys.summary(query),
    queryFn: () => reportService.getFacilitySummary(query),
  });
}

export function useFacilityDetail(
  facilityId: number,
  query: FacilityResultQuery = {},
) {
  return useQuery({
    queryKey: reportKeys.facility(facilityId, query),
    queryFn: () => reportService.getFacilityResults(facilityId, query),
    enabled: facilityId > 0,
  });
}

export function useFacilitySessionSubmissions(sessionId: number) {
  return useQuery({
    queryKey: reportKeys.submissions(sessionId),
    queryFn: () => reportService.getSessionSubmissions(sessionId),
    enabled: sessionId > 0,
  });
}

/** Resetting a submission changes response counts, so refresh reports + sessions. */
export function useDeleteFacilitySubmission() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (submissionId: number) =>
      reportService.deleteSubmission(submissionId),
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: reportKeys.all });
      queryClient.invalidateQueries({ queryKey: sessionKeys.all });
    },
  });
}
