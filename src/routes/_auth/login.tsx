import { createFileRoute } from "@tanstack/react-router";
import { AuthCard, type LoginSearch } from "@/features/auth";
import { redirectIfAuthenticated } from "@/lib/guards";

export const Route = createFileRoute("/_auth/login")({
  validateSearch: (search: Record<string, unknown>): LoginSearch => ({
    error: typeof search.error === "string" ? search.error : undefined,
  }),
  beforeLoad: redirectIfAuthenticated,
  component: AuthCard,
});
