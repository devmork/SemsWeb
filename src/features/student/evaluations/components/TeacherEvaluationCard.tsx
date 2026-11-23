import { ArrowRight, CalendarIcon, CheckCircle2, GraduationCap } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import type { TeacherEvaluation } from "../types";
import { Link } from "@tanstack/react-router";

interface TeacherEvaluationCardProps {
  evaluation: TeacherEvaluation;
}

export function TeacherEvaluationCard({
  evaluation,
}: TeacherEvaluationCardProps) {
  const isCompleted = evaluation.isCompleted;

  return (
    <Card className="gap-4 shadow-sm flex flex-col justify-between">
      <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2">
        <Badge className="bg-brand-accent/10 text-brand-accent hover:bg-brand-accent/20 border-none">
          <GraduationCap className="mr-1 size-3" aria-hidden="true" /> Teacher
        </Badge>
        <Badge variant="outline" className="text-muted-foreground">
          <CalendarIcon className="mr-1 size-3" aria-hidden="true" />
          {evaluation.schoolYear} · Term {evaluation.term}
        </Badge>
      </CardHeader>

      <CardContent className="flex flex-col gap-4 flex-1">
        <div className="flex flex-col gap-1">
          <h3 className="text-lg font-bold leading-tight text-foreground">
            {evaluation.teacherName}
          </h3>
          <div className="flex flex-col text-sm text-brand-accent">
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

      <CardFooter className="flex items-center justify-between gap-3 border-t pt-4 mt-auto">
        <p className="text-xs text-muted-foreground">
          {isCompleted && evaluation.submittedAtUtc
            ? `Submitted ${new Intl.DateTimeFormat(undefined, { month: "short", day: "numeric", year: "numeric" }).format(new Date(evaluation.submittedAtUtc))}`
            : "Pending"}
        </p>
        <Button
          variant={isCompleted ? "outline" : "default"}
          disabled={isCompleted}
          render={
            !isCompleted ? (
              <Link
                to="/student/evaluate/$evaluateId"
                params={{ evaluateId: evaluation.subjectOfferingId.toString() }}
                search={{ type: "teacher" }}
              />
            ) : undefined
          }>
          {isCompleted ? (
            <>
              <CheckCircle2 className="mr-2 size-4" aria-hidden="true" /> Submitted
            </>
          ) : (
            <>
              Start Evaluation <ArrowRight className="ml-2 size-4" aria-hidden="true" />
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
