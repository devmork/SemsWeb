import {
  AlertTriangle,
  ArrowRight,
  CalendarIcon,
  CheckCircle2,
  Clock,
  GraduationCap,
  HeartPulse,
  Stethoscope,
  Utensils,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type {
  EvaluationAssignment,
  EvaluationStatus,
  EvaluationType,
} from "../types";
import type { ElementType } from "react";

const STATUS_CONFIG: Record<
  EvaluationStatus,
  {
    label: string;
    badge: "info" | "warning" | "danger" | "success";
    icon?: typeof Clock;
    cardClass: string;
    cta: string;
  }
> = {
  pending: {
    label: "Pending",
    badge: "info",
    cardClass: "",
    cta: "Start Evaluation",
  },
  overdue: {
    label: "Overdue",
    badge: "danger",
    icon: AlertTriangle,
    cardClass: "ring-rose-300! bg-rose-50/30 dark:bg-rose-500/5",
    cta: "Complete Now",
  },
  completed: {
    label: "Completed",
    badge: "success",
    icon: CheckCircle2,
    cardClass: "",
    cta: "Submitted",
  },
};

function formatDueDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });
}

const CATEGORY_CONFIG: Record<
  EvaluationType,
  { label: string; color: string; icon: ElementType }
> = {
  guidance: {
    label: "Guidance Evaluation",
    color: "bg-purple-100 text-purple-700",
    icon: HeartPulse,
  },
  teacher: {
    label: "Teacher Evaluation",
    color: "bg-blue-100 text-blue-700",
    icon: GraduationCap,
  },
  clinic: {
    label: "Clinic Evaluation",
    color: "bg-teal-100 text-teal-700",
    icon: Stethoscope,
  },
  canteen: {
    label: "Canteen Evaluation",
    color: "bg-orange-100 text-orange-700",
    icon: Utensils,
  },
};

interface EvaluationCardProps {
  evaluation: EvaluationAssignment;
  onStart?: ((evaluation: EvaluationAssignment) => void) | undefined;
}

export function EvaluationCard({ evaluation, onStart }: EvaluationCardProps) {
  const config = CATEGORY_CONFIG[evaluation.type];
  const status = STATUS_CONFIG[evaluation.status];
  const isCompleted = evaluation.status === "completed";

  return (
    <Card className={cn("gap-4 shadow-sm", status.cardClass)}>
      <CardHeader className="flex flex-row items-center justify-between gap-2">
        <Badge className={config.color}>{config.label}</Badge>

        <Badge variant="outline">
          <CalendarIcon className="mr-1 size-3" />
          {evaluation.academicYear} • {evaluation.semester}
        </Badge>

        <Badge variant="default" />
      </CardHeader>

      <CardContent className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <h3 className="text-lg leading-tight">{evaluation.targetName}</h3>
          <p className="text-sm text-brand-accent">
            {evaluation.targetSubtitle}
          </p>
        </div>

        <div className="rounded-lg bg-muted px-4 py-3">
          <p className="text-sm font-semibold">{evaluation.formTitle}</p>
          <p className="text-xs text-muted-foreground">
            {evaluation.formDescription}
          </p>
        </div>
      </CardContent>

      <CardFooter className="flex items-center justify-between gap-3 border-t pt-4">
        <p className="text-xs text-muted-foreground">
          Due:{" "}
          <span className="font-semibold text-foreground">
            {formatDueDate(evaluation.dueDate)}
          </span>{" "}
          ({evaluation.questionCount} questions)
        </p>
        <Button
          variant={isCompleted ? "outline" : "default"}
          disabled={isCompleted}
          onClick={() => onStart?.(evaluation)}>
          {status.cta}
          {!isCompleted && <ArrowRight data-icon="inline-end" />}
        </Button>
      </CardFooter>
    </Card>
  );
}
