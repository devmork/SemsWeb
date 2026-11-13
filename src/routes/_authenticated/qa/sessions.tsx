import { createFileRoute } from "@tanstack/react-router";
import { SessionManagement } from "@/features/evaluation-sessions";

export const Route = createFileRoute("/_authenticated/qa/sessions")({
  component: SessionManagement,
});
