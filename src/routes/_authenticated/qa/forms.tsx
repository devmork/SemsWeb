import { createFileRoute } from "@tanstack/react-router";
import { FormManagement } from "@/features/evaluation-forms";

export const Route = createFileRoute("/_authenticated/qa/forms")({
  component: FormManagement,
});
