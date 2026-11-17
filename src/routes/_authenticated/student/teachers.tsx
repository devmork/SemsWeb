import { TeacherEvaluationList } from "@/features/student/evaluations";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/student/teachers")({
  component: TeacherEvaluationList,
});
