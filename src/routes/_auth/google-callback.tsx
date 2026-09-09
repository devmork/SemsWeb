import { createFileRoute } from "@tanstack/react-router";
import { GoogleCallback, type SearchParams } from "@/features/auth";

export const Route = createFileRoute("/_auth/google-callback")({
  component: GoogleCallback,
  validateSearch: (search: Record<string, unknown>): SearchParams => ({
    code: search.code as string | undefined,
    state: search.state as string | undefined,
    error: search.error as string | undefined,
  }),
});
