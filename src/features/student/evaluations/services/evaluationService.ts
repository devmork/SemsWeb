import { api } from "@/shared/api/client";
import type {
  EvaluationCategory,
  FacilityEvaluation,
  SubmitFacilityEvaluationInput,
  SubmitTeacherEvaluationInput,
  TeacherEvaluation,
} from "../types";

/** Mirrors `SemsApi.DTO.EvaluationAssignments.EvaluationAssignmentDto`. */
type TeacherAssignmentDto = {
  subjectOfferingId: number;
  subjectId: number;
  subjectCode: string;
  subjectDescription: string;
  teacherId: number;
  teacherName: string;
  teacherEmployeeNumber: string;
  gradeLevel: number;
  section: string;
  schoolYear: string;
  term: number;
  evaluationTypeId: number | null;
  formId: number | null;
  isCompleted: boolean;
  submittedAtUtc: string | null;
};

/** Mirrors `SemsApi.DTO.EvaluationSessions.EvaluationSessionDto` (subset). */
type SessionSummaryDto = {
  evaluationSessionId: number;
  formId: number;
  evaluationTypeId: number;
  schoolYear: string;
  term: number;
  gradeLevelFrom: number | null;
  gradeLevelTo: number | null;
  status: string;
  isAvailableNow: boolean;
  closesAtUtc: string | null;
};

/** Mirrors `SemsApi.DTO.Facility.FacilityEvaluationAssignmentDto`. */
type FacilityAssignmentDto = {
  facilityId: number;
  facilityName: string;
  evaluationTypeId: number;
  formId: number;
  evaluationSessionId: number;
  schoolYear: string;
  term: number;
  isCompleted: boolean;
  submittedAtUtc: string | null;
};

/** Mirrors `SemsApi.DTO.Evaluation.EvaluationCategoryDto`. */
type FormCategoryDto = {
  categoryId: number;
  categoryName: string | null;
  categoryRate: number | null;
  questions: { questionId: number; questionName: string | null }[];
};

/** Subset of `EvaluationSessionDetailDto` needed by student evaluation flows. */
type SessionDetailDto = {
  evaluationSessionId: number;
  formId: number;
  evaluationTypeId: number;
  closesAtUtc: string | null;
  evaluationForm: { categories: FormCategoryDto[] } | null;
};

export type TeacherFormContent = {
  evaluationSessionId: number | null;
  closesAtUtc: string | null;
  categories: EvaluationCategory[];
};

function toCategories(dtos: FormCategoryDto[] | null | undefined): EvaluationCategory[] {
  return (dtos ?? []).map((category) => ({
    categoryId: category.categoryId,
    title: category.categoryName ?? `Category ${category.categoryId}`,
    weightPercentage: category.categoryRate,
    questions: (category.questions ?? []).map((question) => ({
      questionId: question.questionId,
      text: question.questionName ?? "",
    })),
  }));
}

export const evaluationService = {
  // ---- assignments -------------------------------------------------------

  async getTeacherEvaluations(): Promise<TeacherEvaluation[]> {
    const { data } = await api.get<TeacherAssignmentDto[]>(
      "/api/evaluation/assignments/me",
    );
    return data.map((dto) => ({
      type: "teacher" as const,
      id: dto.subjectOfferingId,
      subjectOfferingId: dto.subjectOfferingId,
      subjectId: dto.subjectId,
      subjectCode: dto.subjectCode,
      subjectDescription: dto.subjectDescription,
      teacherId: dto.teacherId,
      teacherName: dto.teacherName,
      teacherEmployeeNumber: dto.teacherEmployeeNumber,
      gradeLevel: dto.gradeLevel,
      section: dto.section,
      schoolYear: dto.schoolYear,
      term: dto.term,
      evaluationTypeId: dto.evaluationTypeId,
      formId: dto.formId,
      isCompleted: dto.isCompleted,
      submittedAtUtc: dto.submittedAtUtc,
      status: dto.isCompleted ? "completed" : "pending",
    }));
  },

  async getFacilityEvaluations(): Promise<FacilityEvaluation[]> {
    const { data } = await api.get<FacilityAssignmentDto[]>(
      "/api/evaluation/facility-assignments/me",
    );
    return data.map((dto) => ({
      type: "facility" as const,
      id: dto.facilityId,
      facilityId: dto.facilityId,
      facilityName: dto.facilityName,
      evaluationTypeId: dto.evaluationTypeId,
      formId: dto.formId,
      evaluationSessionId: dto.evaluationSessionId,
      schoolYear: dto.schoolYear,
      term: dto.term,
      isCompleted: dto.isCompleted,
      submittedAtUtc: dto.submittedAtUtc,
      status: dto.isCompleted ? "completed" : "pending",
    }));
  },

  // ---- form content ------------------------------------------------------

  /** `GET /api/evaluation/sessions/{id}` — student-accessible session detail with form content. */
  async getSessionCategories(sessionId: number): Promise<{
    closesAtUtc: string | null;
    categories: EvaluationCategory[];
  }> {
    const { data } = await api.get<SessionDetailDto>(
      `/api/evaluation/sessions/${sessionId}`,
    );
    return {
      closesAtUtc: data.closesAtUtc,
      categories: toCategories(data.evaluationForm?.categories),
    };
  },

  /**
   * Resolve form content for a teacher assignment.
   * Teacher assignments do not include a session id; find the matching open
   * session visible to the student, then load its detail for categories/questions.
   */
  async getTeacherFormContent(params: {
    formId: number | null;
    evaluationTypeId: number | null;
    schoolYear: string;
    term: number;
    gradeLevel: number;
  }): Promise<TeacherFormContent> {
    const { formId, evaluationTypeId, schoolYear, term, gradeLevel } = params;

    const { data: sessions } = await api.get<SessionSummaryDto[]>(
      "/api/evaluation/sessions",
      {
        params: {
          ...(formId != null ? { formId } : {}),
          schoolYear,
          term,
          onlyOpen: true,
        },
      },
    );

    const isGradeMatch = (s: SessionSummaryDto) => {
      if (s.gradeLevelFrom != null && gradeLevel < s.gradeLevelFrom) return false;
      if (s.gradeLevelTo != null && gradeLevel > s.gradeLevelTo) return false;
      return true;
    };

    const candidates = sessions.filter((s) => {
      if (formId != null && s.formId !== formId) return false;
      if (evaluationTypeId != null && s.evaluationTypeId !== evaluationTypeId) {
        return false;
      }
      return isGradeMatch(s);
    });

    // Prefer sessions currently available to the student when the API returns more than one.
    const session =
      candidates.find((s) => s.isAvailableNow) ?? candidates[0] ?? null;

    if (!session) {
      return { evaluationSessionId: null, closesAtUtc: null, categories: [] };
    }

    const detail = await this.getSessionCategories(session.evaluationSessionId);
    return {
      evaluationSessionId: session.evaluationSessionId,
      ...detail,
    };
  },

  // ---- submissions -------------------------------------------------------

  /** `POST /api/evaluation/assignments/me/submit`. */
  async submitTeacherEvaluation(
    input: SubmitTeacherEvaluationInput,
  ): Promise<void> {
    await api.post("/api/evaluation/assignments/me/submit", input);
  },

  /** `POST /api/evaluation/facility-assignments/me/submit`. */
  async submitFacilityEvaluation(
    input: SubmitFacilityEvaluationInput,
  ): Promise<void> {
    await api.post("/api/evaluation/facility-assignments/me/submit", input);
  },
};
