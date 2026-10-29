import type { UserRole } from "@/types/domain";

export interface UserResponse {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  pictureUrl: string | null;
  role: UserRole | null;
}

export interface LoginSearch {
  error?: string | undefined;
}
