import { createFileRoute } from "@tanstack/react-router";
import { SignupCard, redirectIfAuthenticated } from "@/features/auth";

export const Route = createFileRoute("/_auth/signup")({
  beforeLoad: redirectIfAuthenticated,
  component: () => <SignupCard />,
});
