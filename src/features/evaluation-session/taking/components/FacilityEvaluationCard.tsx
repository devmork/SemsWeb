import {
  ArrowRight,
  Building2,
  CalendarIcon,
  CheckCircle2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import type { FacilityEvaluation } from "../types";

interface FacilityEvaluationCardProps {
  evaluation: FacilityEvaluation;
}

export function FacilityEvaluationCard({
  evaluation,
}: FacilityEvaluationCardProps) {
  const isCompleted = evaluation.status === "completed";

  return (
    <Card className="gap-4 shadow-sm flex flex-col justify-between">
      <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2">
        <Badge className="bg-teal-100 text-teal-700 hover:bg-teal-200 border-none">
          <Building2 className="mr-1 size-3" /> {evaluation.category}
        </Badge>
        <Badge variant="outline" className="text-muted-foreground">
          <CalendarIcon className="mr-1 size-3" />
          {evaluation.academicYear} • {evaluation.semester}
        </Badge>
      </CardHeader>

      <CardContent className="flex flex-col gap-4 flex-1">
        <div className="flex flex-col gap-1">
          <h3 className="text-lg font-bold leading-tight text-foreground">
            {evaluation.facilityName}
          </h3>
          <p className="text-sm text-brand-accent font-medium">
            {evaluation.location}
          </p>
        </div>

        <div className="rounded-lg bg-muted/50 p-4 border border-hairline">
          <p className="text-sm font-semibold text-foreground">
            {evaluation.formTitle}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            {evaluation.formDescription}
          </p>
        </div>
      </CardContent>

      <CardFooter className="flex items-center justify-between gap-3 border-t pt-4 mt-auto">
        <p className="text-xs text-muted-foreground">
          Due:{" "}
          <span className="font-semibold text-foreground">
            {new Date(evaluation.dueDate).toLocaleDateString()}
          </span>{" "}
          ({evaluation.questionCount} questions)
        </p>
        <Button
          variant={isCompleted ? "outline" : "default"}
          disabled={isCompleted}>
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
