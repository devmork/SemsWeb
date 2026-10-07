import { Forbidden } from "@/features/auth";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_auth/forbidden")({
  component: Forbidden,
});
