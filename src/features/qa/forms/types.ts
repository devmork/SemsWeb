export interface Form {
  formId: number;
  code: string;
  gradeBand: string | null;
  targetType: string;
  programId: number;
  evaluationTypeId: number;
  evaluationTypeName: string;
  title: string;
  description: string | null;
  createdBy: number;
  isActive: 0 | 1;
  createdAt: string;
}

export interface FormDetail extends Form {
  categories: {
    categoryId: number;
    categoryName: string | null;
    categoryRate: number | null;
    questions: { questionId: number; questionName: string | null }[];
  }[];
}

export interface CreateFormInput {
  code: string;
  gradeBand?: string | undefined;
  targetType?: string | undefined;
  programId: number;
  evaluationTypeId: number;
  title: string;
  description?: string | undefined;
  isActive?: 0 | 1 | undefined;
}

export interface UpdateFormInput {
  code?: string | undefined;
  gradeBand?: string | undefined;
  targetType?: string | undefined;
  programId?: number | undefined;
  evaluationTypeId?: number | undefined;
  title?: string | undefined;
  description?: string | undefined;
  isActive?: 0 | 1 | undefined;
}

export interface EvaluationType {
  evaluationTypeId: number;
  evaluationTypeName: string;
}

export interface CategoryOption {
  categoryId: number;
  evaluationTypeId: number;
  categoryName: string | null;
  categoryRate: number | null;
}

export interface QuestionOption {
  questionId: number;
  questionName: string | null;
}

export const TARGET_TYPES = [
  { value: "SubjectTeacher", label: "Subject Teacher" },
  { value: "Facility", label: "Facility" },
] as const;

export const PROGRAM_OPTIONS = [
  { value: 0, label: "All students" },
  { value: 1, label: "Preschool – Grade 3" },
  { value: 2, label: "Grade 4 – 6" },
  { value: 3, label: "JHS – SHS" },
] as const;

export function programLabel(programId: number): string {
  return (
    PROGRAM_OPTIONS.find((o) => o.value === programId)?.label ?? "All students"
  );
}
