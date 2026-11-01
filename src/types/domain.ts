export type UserRole = "student" | "qa" | "admin";

export interface StudentProfile {
  schoolStudentId: string;
  program: string | null;
  yearLevel: string | null;
  academicYear: string | null;
  semester: string | null;
  enrollmentStatus: string | null;
  suffix: string | null;
}

export interface UserResponse {
  id: number;
  name: string;
  email: string;
  role: UserRole | null;
  pictureUrl: string | null;
}
