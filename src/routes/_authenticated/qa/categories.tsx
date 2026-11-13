import { createFileRoute } from "@tanstack/react-router";
import { CategoryManagement } from "@/features/evaluation-catalog";

export const Route = createFileRoute("/_authenticated/qa/categories")({
  component: CategoryManagement,
});
