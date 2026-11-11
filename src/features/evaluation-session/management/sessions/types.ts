export type SessionStatus = "Draft" | "Open" | "Closed" | "Archived";

export interface Session {
  id: number;
  formId: number;
  formCode: string;
  formTitle: string;
  evaluationTypeId: number;
  evaluationTypeName: string;
  targetType: string;
  programId: number;
  schoolYear: string;
  term: number;
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
  schoolYear: string;
  term: number;
  opensAtUtc: string | null;
  closesAtUtc: string | null;
  notes: string | undefined;
}

export interface UpdateSessionInput {
  status?: SessionStatus | undefined;
  opensAtUtc?: string | null | undefined;
  closesAtUtc?: string | null | undefined;
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

export const TERM_OPTIONS: { value: number; label: string }[] = [
  { value: 1, label: "Term 1" },
  { value: 2, label: "Term 2" },
  { value: 3, label: "Term 3" },
  { value: 4, label: "Term 4" },
];

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
