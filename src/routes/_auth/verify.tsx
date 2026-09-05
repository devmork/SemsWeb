import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { VerifyEmailCard } from "@/features/auth";

interface VerifySearch {
  email: string;
  mode: "login" | "signup";
}

export const Route = createFileRoute("/_auth/verify")({
  validateSearch: (search: Record<string, unknown>): VerifySearch => ({
    email: (search.email as string) ?? "",
    mode: search.mode === "signup" ? "signup" : "login",
  }),
  component: VerifyRoute,
});

function VerifyRoute() {
  const { email, mode } = Route.useSearch();
  const navigate = useNavigate();

  if (!email) {
    navigate({ to: mode === "signup" ? "/signup" : "/login" });
    return null;
  }

  return (
    <VerifyEmailCard
      mode={mode}
      email={email}
      onUseDifferentEmail={() =>
        navigate({ to: mode === "signup" ? "/signup" : "/login" })
      }
    />
  );
}
