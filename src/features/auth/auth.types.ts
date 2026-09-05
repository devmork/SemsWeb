export type AuthStatus = "idle" | "verifying" | "verified" | "denied";

export type UserRole = "student" | "qa" | "admin";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

export interface AuthState {
  status: AuthStatus;
  user: AuthUser | null;
  error: string | null;
}

export interface ContinueWithEmailInput {
  email: string;
}

export interface VerifyCodeInput {
  email: string;
  code: string;
}

export interface VerifyCodeResponse {
  token: string;
}
