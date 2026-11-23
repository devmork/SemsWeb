export { AuthCard } from "./components/AuthCard";
export { AuthLayout } from "./components/AuthLayout";
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
