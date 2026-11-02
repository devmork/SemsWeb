import EvaluationsList from "@/features/evaluation-session/taking/components/EvaluationList";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute(
  "/_authenticated/student/guidance",
)({
  component: () => <EvaluationsList category="guidance" />,
});
