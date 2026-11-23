import { useMemo, useState } from "react";
import { useParams, useSearch, useNavigate, Link } from "@tanstack/react-router";
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
import { useSubmitEvaluation, useEvaluationDetail } from "../hooks/useEvaluations";
import { useAuthStore } from "@/features/auth";
import { semesterLabel } from "@/shared/lib/semester";
import { Progress } from "@/components/ui/progress";
import type { SubmitEvaluationInput } from "../types";

export function EvaluationTakingView() {
  const { evaluateId } = useParams({
    from: "/_authenticated/student/evaluate/$evaluateId",
  });
  const { type, sessionId } = useSearch({
    from: "/_authenticated/student/evaluate/$evaluateId",
  });
  const navigate = useNavigate();
  const userEmail = useAuthStore((s) => s.user?.email) || "student@dmc.edu.ph";

  const { data: evaluation, isPending } = useEvaluationDetail(
    Number(evaluateId),
    type,
    sessionId,
  );

  // keyed by questionId — question ids are unique across categories.
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [currentCategoryIndex, setCurrentCategoryIndex] = useState(0);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const { mutate: submitEvaluation, isPending: isSubmitting } =
    useSubmitEvaluation();

  const listPath = type === "facility" ? "/student/facilities" : "/student/teachers";

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
      answeredCount: Object.values(answers).filter((v) => v >= 1).length,
    };
  }, [evaluation, answers]);

  const progressPercent =
    totalQuestions === 0
      ? 0
      : Math.round((answeredCount / totalQuestions) * 100);

  if (isPending) {
    return (
      <div className="p-4 md:p-8 max-w-7xl mx-auto w-full min-w-0 space-y-6">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-40 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (!evaluation) {
    return (
      <div className="p-4 md:p-8 max-w-7xl mx-auto w-full min-w-0 space-y-3">
        <h2 className="text-xl font-bold">Evaluation not found</h2>
        <p className="text-muted-foreground">
          This evaluation assignment could not be loaded. It may no longer be
          available.
        </p>
        <Button variant="outline" onClick={() => navigate({ to: listPath })}>
          Go back to evaluations
        </Button>
      </div>
    );
  }

  const categories = Array.isArray(evaluation.categories)
    ? evaluation.categories
    : [];
  if (categories.length === 0 || totalQuestions === 0) {
    return (
      <div className="p-4 md:p-8 max-w-7xl mx-auto w-full min-w-0 space-y-3">
        <h2 className="text-xl font-bold">Evaluation form unavailable</h2>
        <p className="text-muted-foreground">
          {type === "teacher"
            ? "The evaluation form for this subject is not available right now. There may be no open evaluation session for your class yet, or the form has no questions."
            : "The evaluation form for this facility is not available right now. The session may be closed or the form has no questions."}
        </p>
        <Button variant="outline" onClick={() => navigate({ to: listPath })}>
          Go back to evaluations
        </Button>
      </div>
    );
  }

  const safeCategoryIndex = Math.min(
    currentCategoryIndex,
    categories.length - 1,
  );
  const activeCategory = categories[safeCategoryIndex]!;
  const isLastCategory = safeCategoryIndex === categories.length - 1;

  const handleRatingChange = (questionId: number, rating: number) => {
    setAnswers((prev) => ({ ...prev, [questionId]: rating }));
  };

  const handleNext = () => {
    if (!isLastCategory) {
      setCurrentCategoryIndex((prev) => prev + 1);
      if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        window.scrollTo({ top: 0 });
      }
    }
  };

  const handlePrev = () => {
    if (currentCategoryIndex > 0) {
      setCurrentCategoryIndex((prev) => prev - 1);
      if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        window.scrollTo({ top: 0 });
      }
    }
  };

  const handleSubmit = () => {
    setSubmitError(null);
    setSubmitSuccess(false);

    if (answeredCount < totalQuestions) {
      const remaining = totalQuestions - answeredCount;
      setSubmitError(
        `Answer ${remaining} more question${remaining === 1 ? "" : "s"} before submitting.`,
      );
      return;
    }

    const payloadAnswers = categories.flatMap((category) =>
      category.questions.map((question) => ({
        categoryId: category.categoryId,
        questionId: question.questionId,
        rateVal: answers[question.questionId] ?? 0,
      })),
    );

    if (payloadAnswers.length === 0) {
      setSubmitError("This evaluation has no questions to submit.");
      return;
    }

    if (evaluation.evaluationTypeId == null) {
      setSubmitError("Evaluation type is missing. Please contact QA.");
      return;
    }

    if (evaluation.type === "facility" && evaluation.evaluationSessionId == null) {
      setSubmitError("Evaluation session is missing for this facility evaluation.");
      return;
    }

    const input: SubmitEvaluationInput =
      evaluation.type === "facility"
        ? {
            type: "facility",
            facilityId: evaluation.id,
            evaluationSessionId: evaluation.evaluationSessionId!,
            evaluationTypeId: evaluation.evaluationTypeId,
            ...(evaluation.formId != null ? { formId: evaluation.formId } : {}),
            answers: payloadAnswers,
          }
        : {
            type: "teacher",
            subjectOfferingId: evaluation.id,
            evaluationTypeId: evaluation.evaluationTypeId,
            ...(evaluation.formId != null ? { formId: evaluation.formId } : {}),
            schoolYear: evaluation.schoolYear,
            term: evaluation.term,
            ...(evaluation.evaluationSessionId != null
              ? { evaluationSessionId: evaluation.evaluationSessionId }
              : {}),
            answers: payloadAnswers,
          };

    submitEvaluation(input, {
      onSuccess: () => {
        setSubmitSuccess(true);
        window.setTimeout(() => navigate({ to: listPath }), 1200);
      },
      onError: (error) => {
        console.error("Submission failed", error);
        const message =
          typeof error === "object" &&
          error !== null &&
          "response" in error &&
          typeof (error as { response?: { data?: { message?: string } } })
            .response?.data?.message === "string"
            ? (error as { response?: { data?: { message?: string } } }).response!
                .data!.message!
            : "Failed to submit evaluation. Please try again.";
        setSubmitError(message);
      },
    });
  };

  return (
    <div className="flex min-w-0 scroll-pt-20 flex-col w-full bg-canvas-soft min-h-screen">
      {/* Sticky Header for Progress & Navigation */}
      <div className="sticky top-0 z-10 flex flex-wrap items-center justify-between gap-2 border-b border-hairline bg-background/80 px-4 py-3 backdrop-blur-md md:px-8">
        <Link
          to={listPath}
          className="flex shrink-0 items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="mr-2 size-4" aria-hidden="true" /> Exit Evaluation
        </Link>

        <div className="flex items-center gap-3">
          <span className="text-xs font-medium text-muted-foreground">
            {answeredCount}/{totalQuestions}
          </span>
          <div className="w-20 sm:w-32">
            <Progress value={progressPercent} className="h-2" />
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="min-w-0 flex-1 w-full max-w-7xl mx-auto px-4 md:px-8 py-6 md:py-8 space-y-6 md:space-y-8">
        {/* Header Card */}
        <div className="bg-card rounded-xl border border-hairline shadow-sm overflow-hidden">
          <div className="min-w-0 p-4 md:p-8 space-y-4">
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-3">
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground break-words scroll-mt-20">
                {evaluation.title}
              </h1>
              <div className="bg-muted text-foreground px-3 py-1.5 rounded-md text-sm font-medium break-words self-start">
                {evaluation.dueDate
                  ? `Due: ${new Intl.DateTimeFormat(undefined, {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    }).format(new Date(evaluation.dueDate))}`
                  : `${evaluation.schoolYear} · ${semesterLabel(evaluation.term)}`}
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 text-sm">
              <span className="font-semibold text-foreground">
                {evaluation.targetName}
              </span>
              {evaluation.targetSubtitle ? (
                <>
                  <span className="text-muted-foreground">·</span>
                  <span className="text-brand-accent font-medium">
                    {evaluation.targetSubtitle}
                  </span>
                </>
              ) : null}
            </div>
          </div>

          <div className="bg-surface-card px-4 py-4 md:px-6 border-t border-hairline flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-sm">
            <div className="flex min-w-0 flex-wrap items-center gap-2">
              <span className="min-w-0 break-all font-medium text-foreground">
                {userEmail}
              </span>
              <span className="text-success flex shrink-0 items-center text-xs font-medium">
                <CheckCircle2 className="size-3.5 mr-1" aria-hidden="true" /> Verified
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
                Category {safeCategoryIndex + 1} of{" "}
                {categories.length}
              </span>
              <h2 className="text-xl font-bold text-foreground mt-1 scroll-mt-20">
                {activeCategory.title}
              </h2>
            </div>
            {activeCategory.weightPercentage != null ? (
              <span className="text-sm font-medium text-muted-foreground bg-muted px-3 py-1 rounded-full self-start sm:self-auto">
                Weight: {activeCategory.weightPercentage}%
              </span>
            ) : null}
          </div>

          {/* Instructions */}
          <div className="bg-surface-card rounded-lg p-4 text-sm text-foreground/80 border border-hairline">
            <p className="mb-2">
              Please rate the following based on a five-scale rating:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2 font-medium">
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
                key={question.questionId}
                className="shadow-sm border-hairline bg-card">
                <CardContent className="p-4 md:p-6">
                  <div className="flex flex-col md:flex-row md:items-start gap-4 md:gap-6">
                    <div className="min-w-0 flex-1 space-y-2">
                      <p className="font-medium text-base text-foreground leading-relaxed break-words">
                        <span className="text-muted-foreground mr-2">
                          {index + 1}.
                        </span>
                        {question.text}{" "}
                        <span className="text-destructive ml-1" aria-hidden="true">
                          *
                        </span>
                      </p>
                    </div>
                    <div className="flex w-full shrink-0 justify-center md:w-auto md:justify-end">
                      <Rating
                        disabled={isSubmitting}
                        value={answers[question.questionId] || 0}
                        onChange={(rating) =>
                          handleRatingChange(question.questionId, rating)
                        }
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Submit status (inline, announced to assistive tech) */}
        {(submitError || submitSuccess) && (
          <div
            role={submitError ? "alert" : "status"}
            aria-live="polite"
            className={`rounded-lg border px-4 py-3 text-sm ${
              submitError
                ? "border-destructive/30 bg-destructive/5 text-destructive"
                : "border-success/30 bg-success/5 text-success"
            }`}>
            {submitError ??
              "Evaluation submitted successfully! Redirecting…"}
          </div>
        )}

        {/* Footer Navigation */}
        <div className="flex flex-col items-stretch gap-3 border-t border-hairline pt-6 mt-8 sm:flex-row sm:items-center sm:justify-between">
          <Button
            variant="outline"
            onClick={handlePrev}
            disabled={safeCategoryIndex === 0 || isSubmitting}
            className="w-full sm:w-32 sm:flex-none">
            <ChevronLeft data-icon="inline-start" aria-hidden="true" /> Previous
          </Button>

          <div className="order-first w-full text-center text-sm text-muted-foreground sm:order-none sm:w-auto sm:text-left">
            {answeredCount < totalQuestions ? (
              <span>
                {answeredCount} of {totalQuestions} answered
              </span>
            ) : (
              <span className="text-success flex items-center justify-center sm:justify-start">
                <CheckCircle2
                  data-icon="inline-start"
                  aria-hidden="true"
                  className="text-success"
                />{" "}
                All questions answered
              </span>
            )}
          </div>

          {isLastCategory ? (
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="w-full sm:w-40 sm:flex-none">
              {isSubmitting ? (
                <>
                  <Loader2
                    data-icon="inline-start"
                    aria-hidden="true"
                    className="animate-spin"
                  />{" "}
                  Submitting…
                </>
              ) : (
                "Submit Evaluation"
              )}
            </Button>
          ) : (
            <Button
              onClick={handleNext}
              className="w-full sm:w-32 sm:flex-none">
              Next
              <ChevronRight data-icon="inline-end" aria-hidden="true" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
