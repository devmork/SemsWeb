/** Filters accepted by the facility-results endpoints. */
export interface FacilityResultQuery {
  sessionId?: number | undefined;
  schoolYear?: string | undefined;
  term?: number | undefined;
}

/** Mirrors `SemsApi.DTO.Facility.FacilityEvaluationSummaryDto`. */
export interface FacilitySummary {
  facilityId: number;
  facilityName: string;
  responseCount: number;
  averageRating: number | null;
}

/** Mirrors `SemsApi.DTO.Facility.FacilityEvaluationCategoryResultDto`. */
export interface FacilityCategoryResult {
  categoryId: number;
  categoryName: string | null;
  categoryRate: number | null;
  responseCount: number;
  averageRating: number | null;
}

/** Mirrors `SemsApi.DTO.Facility.FacilityEvaluationQuestionResultDto`. */
export interface FacilityQuestionResult {
  questionId: number;
  categoryId: number;
  questionName: string | null;
  responseCount: number;
  averageRating: number | null;
}

/** Mirrors `SemsApi.DTO.Facility.FacilityEvaluationDetailResultDto`. */
export interface FacilityDetailResult {
  facilityId: number;
  facilityName: string;
  responseCount: number;
  averageRating: number | null;
  categories: FacilityCategoryResult[];
  questions: FacilityQuestionResult[];
}

/** Mirrors `SemsApi.DTO.Facility.FacilitySessionSubmissionDto`. */
export interface FacilitySubmission {
  submissionId: number;
  studentId: number;
  studentName: string;
  studentNumber: string;
  facilityId: number;
  facilityName: string;
  submittedAtUtc: string;
}
