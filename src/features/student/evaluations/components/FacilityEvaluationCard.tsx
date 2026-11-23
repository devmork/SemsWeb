import { ArrowRight, Building2, CalendarIcon, CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { FacilityEvaluation } from "../types";
import { Link } from "@tanstack/react-router";
import { semesterLabel } from "@/shared/lib/semester";

interface FacilityEvaluationCardProps {
  evaluation: FacilityEvaluation;
}

export function FacilityEvaluationCard({
  evaluation,
}: FacilityEvaluationCardProps) {
  const isCompleted = evaluation.isCompleted;

  return (
    <Card className="gap-4 shadow-sm flex min-w-0 flex-col justify-between">
      <CardHeader className="flex flex-wrap items-start justify-between gap-2 pb-2">
        <Badge className="border-none bg-success/10 text-success hover:bg-success/20">
          <Building2 className="mr-1 size-3" aria-hidden="true" /> Facility
        </Badge>
        <Badge
          variant="outline"
          className="max-w-full break-words text-muted-foreground">
          <CalendarIcon className="mr-1 size-3" aria-hidden="true" />
          {evaluation.schoolYear} · {semesterLabel(evaluation.term)}
        </Badge>
      </CardHeader>

      <CardContent className="flex min-w-0 flex-1 flex-col gap-4">
        <div className="flex min-w-0 flex-col gap-1">
          <CardTitle className="text-lg font-bold leading-tight text-foreground break-words">
            {evaluation.facilityName}
          </CardTitle>
          <p className="break-words text-sm font-medium text-brand-accent">
            {evaluation.schoolYear} · {semesterLabel(evaluation.term)}
          </p>
        </div>
      </CardContent>

      <CardFooter className="flex flex-wrap items-center justify-between gap-3 border-t pt-4 mt-auto">
        <p className="min-w-0 break-words text-xs text-muted-foreground">
          {isCompleted && evaluation.submittedAtUtc
            ? `Submitted ${new Intl.DateTimeFormat(undefined, { month: "short", day: "numeric", year: "numeric" }).format(new Date(evaluation.submittedAtUtc))}`
            : "Pending"}
        </p>
        {isCompleted ? (
          <button
            type="button"
            disabled
            className={buttonVariants({
              variant: "outline",
              className: "w-full sm:w-auto",
            })}>
            <CheckCircle2 data-icon="inline-start" aria-hidden="true" />
            Submitted
          </button>
        ) : (
          <Link
            to="/student/evaluate/$evaluateId"
            params={{ evaluateId: evaluation.facilityId.toString() }}
            search={{
              type: "facility",
              sessionId: evaluation.evaluationSessionId,
            }}
            className={buttonVariants({ className: "w-full sm:w-auto" })}>
            Start Evaluation
            <ArrowRight data-icon="inline-end" aria-hidden="true" />
          </Link>
        )}
      </CardFooter>
    </Card>
  );
}
