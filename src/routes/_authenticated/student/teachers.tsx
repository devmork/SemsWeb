import TeacherEvaluationList from "@/features/evaluation-session/taking/components/TeacherEvaluationList";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/student/teachers")({
  component: TeacherEvaluationList,
});
