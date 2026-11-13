export type EvaluationStatus = "pending" | "overdue" | "completed";

// Base interface for shared fields
interface BaseEvaluation {
  id: number;
  status: EvaluationStatus;
  dueDate: string;
  questionCount: number;
  academicYear?: string;
  semester?: string;
  formTitle: string;
  formDescription: string;
}

// Teacher specific
export interface TeacherEvaluation extends BaseEvaluation {
  type: "teacher";
  teacherName: string;
  subjectCode: string;
  section: string;
}

// Facility specific
export interface FacilityEvaluation extends BaseEvaluation {
  type: "facility";
  facilityName: string;
  location: string;
  category: string; // e.g., "Clinic", "Canteen", "Guidance"
}

export interface EvaluationQuestion {
  id: number;
  text: string;
  isRequired: boolean;
}

export interface EvaluationCategory {
  id: number;
  title: string;
  weightPercentage: number; // e.g., 40 for 40%
  questions: EvaluationQuestion[];
}

export interface EvaluationDetail {
  id: number;
  title: string;
  targetName: string;
  targetSubtitle: string;
  dueDate: string;
  categories: EvaluationCategory[];
  respondentEmail: string;
}

export interface EvaluationAnswer {
  questionId: number;
  rating: number;
}

export interface SubmitEvaluationPayload {
  evaluationId: number;
  answers: EvaluationAnswer[];
}
