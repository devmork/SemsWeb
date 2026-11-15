import { api, API_BASE_URL } from "@/shared/api/client";
import { useAuthStore } from "../stores/auth.store";
import type {
  StudentProfile,
  StudentProfileSubject,
  StudentProfileTeacher,
  UserResponse,
  UserRole,
} from "@/shared/types/user";

const USER_ROLES: readonly UserRole[] = ["admin", "qa", "student"];

function toUserRole(value: string | null): UserRole | null {
  const normalized = value?.toLowerCase();
  return USER_ROLES.find((role) => role === normalized) ?? null;
}

// ---- API transport shapes (mirror SemsApi.DTO.Authentication) --------------

type ApiStudentProfileTeacher = {
  teacherId: number;
  employeeNumber: string | null;
  fullName: string;
};

type ApiStudentProfileSubject = {
  subjectOfferingId: number;
  subjectId: number;
  subjectCode: string;
  subjectDescription: string;
  gradeLevel: string;
  section: string;
  schoolYear: string;
  term: number;
  teacher: ApiStudentProfileTeacher | null;
  enrollmentStatus: string;
};

type ApiStudentProfile = {
  studentId: number;
  studentNumber: string;
  gradeLevel: string | null;
  section: string | null;
  schoolYear: string | null;
  term: number | null;
  status: string;
  subjects: ApiStudentProfileSubject[];
};

type ApiUserResponse = {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  fullName: string;
  pictureUrl: string | null;
  role: string | null;
  studentProfile: ApiStudentProfile | null;
};

function toTeacher(dto: ApiStudentProfileTeacher | null): StudentProfileTeacher | null {
  if (!dto) return null;
  return {
    teacherId: dto.teacherId,
    employeeNumber: dto.employeeNumber,
    fullName: dto.fullName,
  };
}

function toSubject(dto: ApiStudentProfileSubject): StudentProfileSubject {
  return {
    subjectOfferingId: dto.subjectOfferingId,
    subjectId: dto.subjectId,
    subjectCode: dto.subjectCode,
    subjectDescription: dto.subjectDescription,
    gradeLevel: dto.gradeLevel,
    section: dto.section,
    schoolYear: dto.schoolYear,
    term: dto.term,
    teacher: toTeacher(dto.teacher),
    enrollmentStatus: dto.enrollmentStatus,
  };
}

function toStudentProfile(dto: ApiStudentProfile | null): StudentProfile | null {
  if (!dto) return null;
  return {
    studentId: dto.studentId,
    studentNumber: dto.studentNumber,
    gradeLevel: dto.gradeLevel,
    section: dto.section,
    schoolYear: dto.schoolYear,
    term: dto.term,
    status: dto.status,
    subjects: (dto.subjects ?? []).map(toSubject),
  };
}

/** Maps the API user payload onto the frontend session model. */
export function toAuthUser(user: ApiUserResponse): UserResponse {
  return {
    id: user.id,
    name: user.fullName || `${user.firstName} ${user.lastName}`.trim(),
    email: user.email,
    role: toUserRole(user.role),
    pictureUrl: user.pictureUrl,
    studentProfile: toStudentProfile(user.studentProfile),
  };
}

export async function fetchCurrentUser(): Promise<UserResponse | null> {
  try {
    const { data } = await api.get<ApiUserResponse>("/api/auth/me", {
      skipAuthRedirect: true,
    });
    return toAuthUser(data);
  } catch {
    return null;
  }
}

export function startGoogleSignIn(returnUrl = "/") {
  const url = new URL("/api/auth/google/signin", API_BASE_URL);
  url.searchParams.set("returnUrl", returnUrl);
  window.location.assign(url.toString());
}

export async function logout(): Promise<void> {
  try {
    await api.post("/api/auth/logout", undefined, { skipAuthRedirect: true });
  } finally {
    useAuthStore.getState().clearUser();
  }
}
