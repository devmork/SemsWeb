/* eslint-disable react-refresh/only-export-components */
import { createFileRoute } from "@tanstack/react-router";
import { AuthCard, type LoginSearch, redirectIfAuthenticated } from "@/features/auth";

function LoginComponent() {
  const { error } = Route.useSearch();
  return <AuthCard errorCode={error ?? undefined} />;
}

export const Route = createFileRoute("/_auth/login")({
  validateSearch: (search: Record<string, unknown>): LoginSearch => ({
    error: typeof search.error === "string" ? search.error : undefined,
  }),
  beforeLoad: redirectIfAuthenticated,
  component: LoginComponent,
});
