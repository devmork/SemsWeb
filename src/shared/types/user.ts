export type UserRole = "student" | "qa" | "admin";

/** Mirrors `SemsApi.DTO.Authentication.StudentProfileTeacherDto`. */
export interface StudentProfileTeacher {
  teacherId: number;
  employeeNumber: string | null;
  fullName: string;
}

/** Mirrors `SemsApi.DTO.Authentication.StudentProfileSubjectDto`. */
export interface StudentProfileSubject {
  subjectOfferingId: number;
  subjectId: number;
  subjectCode: string;
  subjectDescription: string;
  gradeLevel: string;
  section: string;
  schoolYear: string;
  term: number;
  teacher: StudentProfileTeacher | null;
  enrollmentStatus: string;
}

/** The academic slice of `GET /api/auth/me` (camelCase on the wire). */
export interface StudentProfile {
  studentId: number;
  studentNumber: string;
  gradeLevel: string | null;
  section: string | null;
  schoolYear: string | null;
  term: number | null;
  status: string;
  subjects: StudentProfileSubject[];
}

/**
 * Frontend session model. The API returns `fullName`/`firstName`/`lastName`;
 * `authService.mapUser` flattens `fullName` into `name` for the UI.
 */
export interface UserResponse {
  id: number;
  name: string;
  email: string;
  role: UserRole | null;
  pictureUrl: string | null;
  studentProfile?: StudentProfile | null;
}
