import { ArrowRight, Building2, CalendarIcon, CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import type { FacilityEvaluation } from "../types";
import { Link } from "@tanstack/react-router";

interface FacilityEvaluationCardProps {
  evaluation: FacilityEvaluation;
}

export function FacilityEvaluationCard({
  evaluation,
}: FacilityEvaluationCardProps) {
  const isCompleted = evaluation.isCompleted;

  return (
    <Card className="gap-4 shadow-sm flex flex-col justify-between">
      <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2">
        <Badge className="bg-success/10 text-success hover:bg-success/20 border-none">
          <Building2 className="mr-1 size-3" /> Facility
        </Badge>
        <Badge variant="outline" className="text-muted-foreground">
          <CalendarIcon className="mr-1 size-3" />
          {evaluation.schoolYear} · Term {evaluation.term}
        </Badge>
      </CardHeader>

      <CardContent className="flex flex-col gap-4 flex-1">
        <div className="flex flex-col gap-1">
          <h3 className="text-lg font-bold leading-tight text-foreground">
            {evaluation.facilityName}
          </h3>
          <p className="text-sm text-brand-accent font-medium">
            {evaluation.schoolYear} · Term {evaluation.term}
          </p>
        </div>
      </CardContent>

      <CardFooter className="flex items-center justify-between gap-3 border-t pt-4 mt-auto">
        <p className="text-xs text-muted-foreground">
          {isCompleted && evaluation.submittedAtUtc
            ? `Submitted ${new Date(evaluation.submittedAtUtc).toLocaleDateString()}`
            : "Pending"}
        </p>
        <Button
          variant={isCompleted ? "outline" : "default"}
          disabled={isCompleted}
          render={
            !isCompleted ? (
              <Link
                to="/student/evaluate/$evaluateId"
                params={{ evaluateId: evaluation.facilityId.toString() }}
                search={{ type: "facility", sessionId: evaluation.evaluationSessionId }}
              />
            ) : undefined
          }>
          {isCompleted ? (
            <>
              <CheckCircle2 className="mr-2 size-4" /> Submitted
            </>
          ) : (
            <>
              Start Evaluation <ArrowRight className="ml-2 size-4" />
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
