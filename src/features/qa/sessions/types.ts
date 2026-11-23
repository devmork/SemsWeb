export type SessionStatus = "Draft" | "Open" | "Closed" | "Archived";

export interface Session {
  id: number;
  formId: number;
  formTitle: string;
  evaluationTypeId: number;
  evaluationTypeName: string;
  facilityId: number | null;
  facilityName: string | null;
  schoolYear: string;
  term: number;
  gradeLevelFrom: number | null;
  gradeLevelTo: number | null;
  opensAtUtc: string | null;
  closesAtUtc: string | null;
  status: SessionStatus;
  notes: string | null;
  createdBy: number;
  createdAtUtc: string;
  updatedAtUtc: string;
  submissionCount: number;
  isAvailableNow: boolean;
}

export interface CreateSessionInput {
  formId: number;
  /** Required when the selected form's evaluation type is a facility evaluation. */
  facilityId?: number | null | undefined;
  schoolYear: string;
  term: number;
  gradeLevelFrom?: number | null | undefined;
  gradeLevelTo?: number | null | undefined;
  opensAtUtc: string | null;
  closesAtUtc: string | null;
  notes: string | undefined;
}

/** Minimal active-facility shape needed by the session picker. */
export interface FacilityOption {
  facilityId: number;
  facilityName: string;
}

export interface UpdateSessionInput {
  status?: SessionStatus | undefined;
  opensAtUtc?: string | null | undefined;
  closesAtUtc?: string | null | undefined;
  gradeLevelFrom?: number | null | undefined;
  gradeLevelTo?: number | null | undefined;
  notes?: string | undefined;
}

export interface SessionSubmission {
  submissionId: number;
  studentId: number;
  studentName: string;
  studentNumber: string;
  subjectCode: string;
  teacherName: string;
  submittedAtUtc: string;
}

/** Shape of the `form` object returned by `GET /api/evaluation/sessions/{id}`. */
export interface SessionDetailForm {
  formId: number;
  evaluationTypeId: number;
  evaluationTypeName: string;
  title: string;
  description: string | null;
  createdBy: number;
  isActive: 0 | 1;
  createdAt: string;
  categories: {
    categoryId: number;
    categoryName: string | null;
    categoryRate: number | null;
    questions: { questionId: number; questionName: string | null }[];
  }[];
}

export interface SessionDetail extends Session {
  evaluationForm: SessionDetailForm | null;
}

export const MIN_GRADE_LEVEL = 0;
export const MAX_GRADE_LEVEL = 14;

/**
 * Mirrors `SemsApi/Utilities/GradeLevelHelper`: 0 = Nursery, 1 = Kinder 1,
 * 2 = Kinder 2, 3 = Grade 1 … 14 = Grade 12. The API stores this internal
 * number, so QA must enter (and read) the same scale.
 */
export function formatGradeLevel(value: number): string {
  if (value === 0) return "Nursery";
  if (value === 1) return "Kinder 1";
  if (value === 2) return "Kinder 2";
  if (value >= 3 && value <= 14) return `Grade ${value - 2}`;
  return `Level ${value}`;
}

export const GRADE_LEVEL_OPTIONS: { value: number; label: string }[] = Array.from(
  { length: MAX_GRADE_LEVEL - MIN_GRADE_LEVEL + 1 },
  (_, index) => {
    const value = MIN_GRADE_LEVEL + index;
    return { value, label: formatGradeLevel(value) };
  },
);

export function formatGradeRange(
  from: number | null,
  to: number | null,
): string {
  if (from == null && to == null) return "All grades";
  if (from != null && to != null) {
    return from === to
      ? formatGradeLevel(from)
      : `${formatGradeLevel(from)} – ${formatGradeLevel(to)}`;
  }
  if (from != null) return `${formatGradeLevel(from)} and up`;
  return `Up to ${formatGradeLevel(to!)}`;
}

export const SESSION_STATUSES: { value: SessionStatus; label: string }[] = [
  { value: "Draft", label: "Draft" },
  { value: "Open", label: "Open" },
  { value: "Closed", label: "Closed" },
  { value: "Archived", label: "Archived" },
];

export function sessionStatusLabel(status: SessionStatus): string {
  return (
    SESSION_STATUSES.find((s) => s.value === status)?.label ?? status
  );
}

export function sessionStatusVariant(status: SessionStatus) {
  switch (status) {
    case "Open":
      return "default";
    case "Closed":
      return "secondary";
    case "Archived":
      return "destructive";
    case "Draft":
    default:
      return "outline";
  }
}
