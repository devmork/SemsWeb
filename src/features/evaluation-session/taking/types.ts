export type EvaluationType = "guidance" | "teacher" | "clinic" | "canteen";

export type EvaluationStatus = "pending" | "overdue" | "completed";

export interface EvaluationAssignment {
  id: number;
  type: EvaluationType;
  status: EvaluationStatus;
  targetName: string;
  targetSubtitle: string;
  formTitle: string;
  formDescription: string;
  dueDate: string;
  questionCount: number;
  academicYear?: string;
  semester?: string;
}
