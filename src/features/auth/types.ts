export type AuthStatus = "idle" | "verifying" | "verified" | "denied";

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

export type SearchParams = {
  code?: string | undefined;
  state?: string | undefined;
  error?: string | undefined;
};
