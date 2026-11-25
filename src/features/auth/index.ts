export { AuthLayout } from "./components/AuthLayout";
export { LoginCard } from "./components/LoginCard";
export { SignupCard } from "./components/SignupCard";
export { GoogleIcon } from "./components/GoogleIcon";

export {
  startGoogleSignIn,
  logout,
  fetchCurrentUser,
  acceptAuthRedirect,
  exchangeSignInCode,
} from "./services/authService";

export {
  restoreSession,
  requireAuth,
  requireRole,
  redirectIfAuthenticated,
} from "./guards";

export { useAuthStore } from "./stores/auth.store";
export { useRoleNavigation } from "./hooks/useRoleNavigation";

export type { LoginSearch } from "./types";
