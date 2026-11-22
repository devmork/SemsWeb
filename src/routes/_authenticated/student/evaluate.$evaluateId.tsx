import { EvaluationTakingView } from "@/features/student/evaluations";
import type { EvaluationKind } from "@/features/student/evaluations";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute(
  "/_authenticated/student/evaluate/$evaluateId",
)({
  validateSearch: (search: Record<string, unknown>): { type: EvaluationKind; sessionId?: number } => {
    const result: { type: EvaluationKind; sessionId?: number } = {
      type: search.type === "facility" ? "facility" : "teacher",
    };
    if (typeof search.sessionId === "number") {
      result.sessionId = search.sessionId;
    }
    return result;
  },
  component: EvaluationTakingView,
});
