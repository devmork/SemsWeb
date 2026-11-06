import { createFileRoute } from "@tanstack/react-router";
import { CategoryManagement } from "@/features/evaluation-session/management";

export const Route = createFileRoute("/_authenticated/qa/categories")({
  component: CategoryManagement,
});
