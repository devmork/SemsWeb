import { createFileRoute } from "@tanstack/react-router";
import { SessionManagement } from "@/features/qa/sessions";

export const Route = createFileRoute("/_authenticated/qa/sessions")({
  component: SessionManagement,
});
