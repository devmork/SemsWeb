import { api } from "@/shared/api/client";
import type {
  FacilityDetailResult,
  FacilityResultQuery,
  FacilitySubmission,
  FacilitySummary,
} from "../types";

type FacilitySummaryDto = {
  facilityId: number;
  facilityName: string;
  responseCount: number;
  averageRating: number | null;
};

type FacilityCategoryResultDto = {
  categoryId: number;
  categoryName: string | null;
  categoryRate: number | null;
  responseCount: number;
  averageRating: number | null;
};

type FacilityQuestionResultDto = {
  questionId: number;
  categoryId: number;
  questionName: string | null;
  responseCount: number;
  averageRating: number | null;
};

type FacilityDetailResultDto = {
  facilityId: number;
  facilityName: string;
  responseCount: number;
  averageRating: number | null;
  categories: FacilityCategoryResultDto[];
  questions: FacilityQuestionResultDto[];
};

type FacilitySubmissionDto = {
  submissionId: number;
  studentId: number;
  studentName: string;
  studentNumber: string;
  facilityId: number;
  facilityName: string;
  submittedAtUtc: string;
};

/** Decimal columns arrive as `number` (camelCase JSON) or `null` when unanswered. */
function toNumber(value: unknown): number | null {
  return typeof value === "number" ? value : null;
}

/** Only send filters that were actually chosen. */
function toParams(query: FacilityResultQuery) {
  const params: Record<string, string | number> = {};
  if (query.sessionId) params.sessionId = query.sessionId;
  if (query.schoolYear) params.schoolYear = query.schoolYear;
  if (query.term) params.term = query.term;
  return Object.keys(params).length > 0 ? params : undefined;
}

function toSummary(dto: FacilitySummaryDto): FacilitySummary {
  return {
    facilityId: dto.facilityId,
    facilityName: dto.facilityName,
    responseCount: dto.responseCount,
    averageRating: toNumber(dto.averageRating),
  };
}

function toDetail(dto: FacilityDetailResultDto): FacilityDetailResult {
  return {
    facilityId: dto.facilityId,
    facilityName: dto.facilityName,
    responseCount: dto.responseCount,
    averageRating: toNumber(dto.averageRating),
    categories: (dto.categories ?? []).map((c) => ({
      categoryId: c.categoryId,
      categoryName: c.categoryName,
      categoryRate: toNumber(c.categoryRate),
      responseCount: c.responseCount,
      averageRating: toNumber(c.averageRating),
    })),
    questions: (dto.questions ?? []).map((q) => ({
      questionId: q.questionId,
      categoryId: q.categoryId,
      questionName: q.questionName,
      responseCount: q.responseCount,
      averageRating: toNumber(q.averageRating),
    })),
  };
}

function toSubmission(dto: FacilitySubmissionDto): FacilitySubmission {
  return {
    submissionId: dto.submissionId,
    studentId: dto.studentId,
    studentName: dto.studentName,
    studentNumber: dto.studentNumber,
    facilityId: dto.facilityId,
    facilityName: dto.facilityName,
    submittedAtUtc: dto.submittedAtUtc,
  };
}

export const reportService = {
  /** `GET /api/evaluation/facility-results/summary` (QA + Admin). */
  async getFacilitySummary(
    query: FacilityResultQuery = {},
  ): Promise<FacilitySummary[]> {
    const { data } = await api.get<unknown>(
      "/api/evaluation/facility-results/summary",
      { params: toParams(query) },
    );
    if (!Array.isArray(data)) return [];
    return (data as FacilitySummaryDto[]).map(toSummary);
  },

  /** `GET /api/evaluation/facility-results/facility/{facilityId}`. */
  async getFacilityResults(
    facilityId: number,
    query: FacilityResultQuery = {},
  ): Promise<FacilityDetailResult> {
    const { data } = await api.get<FacilityDetailResultDto>(
      `/api/evaluation/facility-results/facility/${facilityId}`,
      { params: toParams(query) },
    );
    return toDetail(data);
  },

  /** `GET /api/evaluation/facility-results/session/{sessionId}/submissions`. */
  async getSessionSubmissions(sessionId: number): Promise<FacilitySubmission[]> {
    const { data } = await api.get<unknown>(
      `/api/evaluation/facility-results/session/${sessionId}/submissions`,
    );
    if (!Array.isArray(data)) return [];
    return (data as FacilitySubmissionDto[]).map(toSubmission);
  },

  /** `DELETE /api/evaluation/facility-assignments/{submissionId}` (QA + Admin). */
  async deleteSubmission(submissionId: number): Promise<void> {
    await api.delete(`/api/evaluation/facility-assignments/${submissionId}`);
  },
};
