export type EvaluationKind = "teacher" | "facility";

export type EvaluationStatus = "pending" | "completed";

/**
 * Mirrors `SemsApi.DTO.EvaluationAssignments.EvaluationAssignmentDto`
 * (`GET /api/evaluation/assignments/me`).
 */
export interface TeacherEvaluation {
  type: "teacher";
  /** Alias of `subjectOfferingId`, used by the route param. */
  id: number;
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
  status: EvaluationStatus;
}

/**
 * Mirrors `SemsApi.DTO.Facility.FacilityEvaluationAssignmentDto`
 * (`GET /api/evaluation/facility-assignments/me`).
 */
export interface FacilityEvaluation {
  type: "facility";
  /** Alias of `facilityId`, used by the route param. */
  id: number;
  facilityId: number;
  facilityName: string;
  evaluationTypeId: number;
  formId: number;
  evaluationSessionId: number;
  schoolYear: string;
  term: number;
  isCompleted: boolean;
  submittedAtUtc: string | null;
  status: EvaluationStatus;
}

export type StudentEvaluation = TeacherEvaluation | FacilityEvaluation;

export interface EvaluationQuestion {
  qnNo: number;
  text: string;
}

export interface EvaluationCategory {
  catNo: number;
  title: string;
  weightPercentage: number | null;
  questions: EvaluationQuestion[];
}

/** Composed view model for the taking screen (assignment + form content). */
export interface EvaluationDetail {
  id: number;
  type: EvaluationKind;
  title: string;
  targetName: string;
  targetSubtitle: string;
  dueDate: string | null;
  schoolYear: string;
  term: number;
  evaluationTypeId: number | null;
  formId: number | null;
  evaluationSessionId: number | null;
  categories: EvaluationCategory[];
}

/** Mirrors `SemsApi.DTO.EvaluationAssignments.EvaluationAnswerDto`. */
export interface EvaluationAnswer {
  catNo: number;
  qnNo: number;
  rateVal: number;
}

/** Mirrors `SemsApi.DTO.EvaluationAssignments.SubmitSubjectEvaluationRequest`. */
export interface SubmitTeacherEvaluationInput {
  subjectOfferingId: number;
  evaluationTypeId: number;
  formId?: number | undefined;
  schoolYear: string;
  term: number;
  evaluationSessionId?: number | undefined;
  answers: EvaluationAnswer[];
}

/** Mirrors `SemsApi.DTO.Facility.SubmitFacilityEvaluationRequest`. */
export interface SubmitFacilityEvaluationInput {
  facilityId: number;
  evaluationSessionId: number;
  evaluationTypeId: number;
  formId?: number | undefined;
  answers: EvaluationAnswer[];
}

export type SubmitEvaluationInput =
  | ({ type: "teacher" } & SubmitTeacherEvaluationInput)
  | ({ type: "facility" } & SubmitFacilityEvaluationInput);
