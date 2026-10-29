import { createFileRoute, redirect } from "@tanstack/react-router";
import { redirectIfAuthenticated } from "@/lib/guards";

// Landing route. The backend redirects here after a successful Google login.
export const Route = createFileRoute("/")({
  beforeLoad: async () => {
    await redirectIfAuthenticated();
    throw redirect({ to: "/login" });
  },
});
