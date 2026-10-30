export type UserRole = "student" | "qa" | "admin";

export interface AuthUser {
  id: number;
  name: string;
  email: string;
  role: UserRole | null;
  pictureUrl: string | null;
}
