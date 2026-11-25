import { createFileRoute } from "@tanstack/react-router";
import { CategoryManagement } from "@/features/qa/categories";

export const Route = createFileRoute("/_authenticated/qa/categories")({
  component: CategoryManagement,
});
