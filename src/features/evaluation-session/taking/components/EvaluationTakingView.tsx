import { useMemo, useState } from "react";
import { useParams, useNavigate, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { evaluationService } from "../service/evaluationService";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  ArrowLeft,
  Loader2,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Rating } from "./Rating";
import { useSubmitEvaluation } from "../hooks/useEvaluations";
import { useAuthStore } from "@/stores/auth.store";
import { Progress } from "@/components/ui/progress";

export function EvaluationTakingView() {
  const { evaluateId } = useParams({
    from: "/_authenticated/student/evaluate/$evaluateId",
  });
  const navigate = useNavigate();
  const userEmail = useAuthStore((s) => s.user?.email) || "student@dmc.edu.ph";

  const { data: evaluation, isPending } = useQuery({
    queryKey: ["evaluation", evaluateId],
    queryFn: () => evaluationService.getEvaluationDetail(Number(evaluateId)),
  });

  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [currentCategoryIndex, setCurrentCategoryIndex] = useState(0);

  const { mutate: submitEvaluation, isPending: isSubmitting } =
    useSubmitEvaluation();

  // Defensive check: Ensure evaluation and categories exist before calculating
  const { totalQuestions, answeredCount } = useMemo(() => {
    if (!evaluation || !Array.isArray(evaluation.categories)) {
      return { totalQuestions: 0, answeredCount: 0 };
    }
    const total = evaluation.categories.reduce(
      (acc, cat) => acc + (cat.questions?.length || 0),
      0,
    );
    return {
      totalQuestions: total,
      answeredCount: Object.keys(answers).length,
    };
  }, [evaluation, answers]);

  const progressPercent =
    totalQuestions === 0
      ? 0
      : Math.round((answeredCount / totalQuestions) * 100);

  if (isPending) {
    return (
      <div className="p-8 max-w-7xl mx-auto w-full space-y-6">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-40 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  // Defensive check: Show error if evaluation is missing or malformed
  if (
    !evaluation ||
    !Array.isArray(evaluation.categories) ||
    evaluation.categories.length === 0
  ) {
    return (
      <div className="p-8 text-destructive max-w-7xl mx-auto w-full">
        <h2 className="text-xl font-bold mb-2">Invalid Evaluation Data</h2>
        <p>The evaluation could not be loaded or is in an invalid format.</p>
        <Button
          variant="outline"
          className="mt-4"
          onClick={() => navigate({ to: "/student/teachers" })}>
          Go back to evaluations
        </Button>
      </div>
    );
  }

  const activeCategory = evaluation.categories[currentCategoryIndex]!;
  const isLastCategory =
    currentCategoryIndex === evaluation.categories.length - 1;

  const handleRatingChange = (questionId: number, rating: number) => {
    setAnswers((prev) => ({ ...prev, [questionId]: rating }));
  };

  const handleNext = () => {
    if (!isLastCategory) {
      setCurrentCategoryIndex((prev) => prev + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handlePrev = () => {
    if (currentCategoryIndex > 0) {
      setCurrentCategoryIndex((prev) => prev - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleSubmit = () => {
    const formattedAnswers = Object.entries(answers).map(
      ([questionId, rating]) => ({
        questionId: Number(questionId),
        rating,
      }),
    );

    submitEvaluation(
      {
        id: evaluation.id,
        payload: { evaluationId: evaluation.id, answers: formattedAnswers },
      },
      {
        onSuccess: () => {
          alert("Evaluation submitted successfully!");
          navigate({ to: "/student/facilities" });
        },
        onError: (error) => {
          console.error("Submission failed", error);
          alert("Failed to submit evaluation. Please try again.");
        },
      },
    );
  };

  return (
    <div className="flex flex-col w-full bg-canvas-soft min-h-screen">
      {/* Sticky Header for Progress & Navigation */}
      <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b border-hairline px-4 md:px-8 py-3 flex items-center justify-between">
        <Link
          to="/student/teachers"
          className="flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="mr-2 size-4" /> Exit Evaluation
        </Link>

        <div className="flex items-center gap-4">
          <span className="text-xs font-medium text-muted-foreground hidden sm:inline-block">
            {answeredCount} of {totalQuestions} Answered
          </span>
          <div className="w-32">
            <Progress value={progressPercent} className="h-2" />
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 w-full max-w-7xl mx-auto px-4 md:px-8 py-8 space-y-8">
        {/* Header Card */}
        <div className="bg-card rounded-xl border border-hairline shadow-sm overflow-hidden">
          <div className="p-6 md:p-8 space-y-4">
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
                {evaluation.title}
              </h1>
              <div className="bg-muted text-foreground px-3 py-1.5 rounded-md text-sm font-medium whitespace-nowrap self-start">
                Due:{" "}
                {new Date(evaluation.dueDate).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 text-sm">
              <span className="font-semibold text-foreground">
                {evaluation.targetName}
              </span>
              <span className="text-muted-foreground">•</span>
              <span className="text-brand-accent font-medium">
                {evaluation.targetSubtitle}
              </span>
            </div>
          </div>

          <div className="bg-surface-card px-6 py-4 border-t border-hairline flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-sm">
            <div className="flex items-center gap-2">
              <span className="font-medium text-foreground">{userEmail}</span>
              <span className="text-success flex items-center text-xs font-medium">
                <CheckCircle2 className="size-3.5 mr-1" /> Verified
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              Your email is recorded for tracking.
            </p>
          </div>
        </div>

        {/* Category & Questions Section */}
        <div className="space-y-6">
          {/* Category Header */}
          <div className="border-b border-hairline pb-4 flex flex-col sm:flex-row sm:items-end justify-between gap-2">
            <div>
              <span className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                Category {currentCategoryIndex + 1} of{" "}
                {evaluation.categories.length}
              </span>
              <h2 className="text-xl font-bold text-foreground mt-1">
                {activeCategory.title}
              </h2>
            </div>
            <span className="text-sm font-medium text-muted-foreground bg-muted px-3 py-1 rounded-full self-start sm:self-auto">
              Weight: {activeCategory.weightPercentage}%
            </span>
          </div>

          {/* Instructions */}
          <div className="bg-surface-card rounded-lg p-4 text-sm text-foreground/80 border border-hairline">
            <p className="mb-2">
              Please rate the following based on a five-scale rating:
            </p>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-2 font-medium">
              <div>
                <strong>5</strong> Outstanding
              </div>
              <div>
                <strong>4</strong> Well-demonstrated
              </div>
              <div>
                <strong>3</strong> Satisfactory
              </div>
              <div>
                <strong>2</strong> Needs Development
              </div>
              <div>
                <strong>1</strong> Not Demonstrated
              </div>
            </div>
          </div>

          {/* Question List */}
          <div className="grid gap-4">
            {activeCategory.questions.map((question, index) => (
              <Card
                key={question.id}
                className="shadow-sm border-hairline bg-card">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row md:items-start gap-6">
                    <div className="flex-1 space-y-2">
                      <p className="font-medium text-base text-foreground leading-relaxed">
                        <span className="text-muted-foreground mr-2">
                          {index + 1}.
                        </span>
                        {question.text}{" "}
                        {question.isRequired && (
                          <span className="text-destructive ml-1">*</span>
                        )}
                      </p>
                    </div>
                    <div className="shrink-0 flex justify-center md:justify-end">
                      <Rating
                        disabled={isSubmitting}
                        value={answers[question.id] || 0}
                        onChange={(rating) =>
                          handleRatingChange(question.id, rating)
                        }
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Footer Navigation */}
        <div className="flex items-center justify-between pt-6 border-t border-hairline mt-8">
          <Button
            variant="outline"
            onClick={handlePrev}
            disabled={currentCategoryIndex === 0 || isSubmitting}
            className="w-32">
            <ChevronLeft className="mr-2 size-4" /> Previous
          </Button>

          <div className="text-sm text-muted-foreground hidden sm:block">
            {answeredCount < totalQuestions ? (
              <span className="text-destructive font-medium flex items-center">
                Please answer all required questions to submit.
              </span>
            ) : (
              <span className="text-success font-medium flex items-center">
                <CheckCircle2 className="mr-1.5 size-4" /> All questions
                answered
              </span>
            )}
          </div>

          {isLastCategory ? (
            <Button
              onClick={handleSubmit}
              disabled={answeredCount < totalQuestions || isSubmitting}
              className="w-40 bg-primary hover:bg-primary/90 text-primary-foreground">
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 size-4 animate-spin" /> Submitting...
                </>
              ) : (
                "Submit Evaluation"
              )}
            </Button>
          ) : (
            <Button
              onClick={handleNext}
              className="w-32 bg-primary hover:bg-primary/90 text-primary-foreground">
              Next <ChevronRight className="ml-2 size-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
