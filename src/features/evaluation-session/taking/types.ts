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
