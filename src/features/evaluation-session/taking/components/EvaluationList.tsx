import { useMyEvaluations } from "../hooks/useMyEvaluations";
import { EvaluationCard } from "./EvaluationCard";
import type { EvaluationType } from "../types";

interface EvaluationsListProps {
  category: EvaluationType;
}

export default function EvaluationsList({ category }: EvaluationsListProps) {
  const { data, isPending, isError } = useMyEvaluations(category);

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
