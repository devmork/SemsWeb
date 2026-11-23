import { createFileRoute, redirect } from "@tanstack/react-router";
import { acceptAuthRedirect, redirectIfAuthenticated } from "@/features/auth";

// Landing route. The backend redirects here after a successful Google login
// with a one-time `?code=` that is exchanged for tokens before the guard runs.
export const Route = createFileRoute("/")({
  beforeLoad: async () => {
    const result = await acceptAuthRedirect();
    if (result === "failed") {
      throw redirect({ to: "/login", search: { error: "signin_expired" } });
    }
    await redirectIfAuthenticated();
    throw redirect({ to: "/login" });
  },
});
