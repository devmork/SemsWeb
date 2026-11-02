export interface StudentProfileData {
  id: string | number;
  firstName: string;
  lastName: string;
  suffix?: string | null;
  email: string;
  avatarUrl?: string | null;
  program: string;
  yearLevel: string;
  academicYear: string;
  semester: string;
  enrollmentStatus: string;
}
