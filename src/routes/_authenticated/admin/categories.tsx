import { createFileRoute } from "@tanstack/react-router";
import { CategoryManagement } from "@/features/admin/categories";

export const Route = createFileRoute("/_authenticated/admin/categories")({
  component: CategoryManagement,
});
