import { EvaluationCard } from "./EvaluationCard";
import type { EvaluationType } from "../types";
import { EvaluationCardSkeleton } from "./EvaluationCardSkeleton";
import { useEvaluations } from "../hooks/useEvaluation";

interface EvaluationsListProps {
  category: EvaluationType;
}

export default function EvaluationsList({ category }: EvaluationsListProps) {
  const { data, isPending, isError } = useEvaluations(category);

  if (isPending) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <EvaluationCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (isError) {
    return <div className="text-destructive">Failed to load evaluations.</div>;
  }

  if (!Array.isArray(data) || data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-10 text-center border rounded-xl bg-card">
        <p className="font-medium">No evaluations found</p>
        <p className="text-sm text-muted-foreground">
          You have no {category} evaluations assigned at this time.
        </p>
      </div>
    );
  }
  return (
    <div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {data.map((evaluation) => (
          <EvaluationCard key={evaluation.id} evaluation={evaluation} />
        ))}
      </div>
    </div>
  );
}
