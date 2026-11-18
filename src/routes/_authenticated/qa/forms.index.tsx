import { createFileRoute } from "@tanstack/react-router";
import { FormManagement } from "@/features/qa/forms";

export const Route = createFileRoute("/_authenticated/qa/forms/")({
  component: FormManagement,
});
