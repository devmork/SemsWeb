import { createFileRoute } from "@tanstack/react-router";
import { QuestionManagement } from "@/features/evaluation-catalog";

export const Route = createFileRoute("/_authenticated/qa/questions/$catNo")({
  component: QuestionManagement,
});
