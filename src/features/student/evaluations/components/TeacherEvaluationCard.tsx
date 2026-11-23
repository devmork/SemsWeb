import { ArrowRight, CalendarIcon, CheckCircle2, GraduationCap } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { TeacherEvaluation } from "../types";
import { Link } from "@tanstack/react-router";
import { semesterLabel } from "@/shared/lib/semester";

interface TeacherEvaluationCardProps {
  evaluation: TeacherEvaluation;
}

export function TeacherEvaluationCard({
  evaluation,
}: TeacherEvaluationCardProps) {
  const isCompleted = evaluation.isCompleted;

  return (
    <Card className="gap-4 shadow-sm flex min-w-0 flex-col justify-between">
      <CardHeader className="flex flex-wrap items-start justify-between gap-2 pb-2">
        <Badge className="border-none bg-brand-accent/10 text-brand-accent hover:bg-brand-accent/20">
          <GraduationCap className="mr-1 size-3" aria-hidden="true" /> Teacher
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
            {evaluation.teacherName}
          </CardTitle>
          <div className="flex flex-col text-sm break-words text-brand-accent">
            <span className="font-semibold">{evaluation.subjectCode}</span>
            <span className="text-muted-foreground text-xs">
              {evaluation.subjectDescription}
            </span>
            <span className="text-muted-foreground text-xs">
              Grade {evaluation.gradeLevel} · {evaluation.section}
            </span>
          </div>
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
            params={{ evaluateId: evaluation.subjectOfferingId.toString() }}
            search={{ type: "teacher" }}
            className={buttonVariants({ className: "w-full sm:w-auto" })}>
            Start Evaluation
            <ArrowRight data-icon="inline-end" aria-hidden="true" />
          </Link>
        )}
      </CardFooter>
    </Card>
  );
}
