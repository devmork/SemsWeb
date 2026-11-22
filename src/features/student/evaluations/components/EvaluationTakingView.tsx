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
      <div className="p-8 max-w-7xl mx-auto w-full space-y-6">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-40 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (!evaluation) {
    return (
      <div className="p-8 max-w-7xl mx-auto w-full space-y-3">
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
      <div className="p-8 max-w-7xl mx-auto w-full space-y-3">
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
    const payloadAnswers = categories.flatMap((category) =>
      category.questions.map((question) => ({
        categoryId: category.categoryId,
        questionId: question.questionId,
        rateVal: answers[question.questionId] ?? 0,
      })),
    );

    if (payloadAnswers.length === 0) {
      alert("This evaluation has no questions to submit.");
      return;
    }

    if (evaluation.evaluationTypeId == null) {
      alert("Evaluation type is missing. Please contact QA.");
      return;
    }

    if (evaluation.type === "facility" && evaluation.evaluationSessionId == null) {
      alert("Evaluation session is missing for this facility evaluation.");
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
        alert("Evaluation submitted successfully!");
        navigate({ to: listPath });
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
        alert(message);
      },
    });
  };

  return (
    <div className="flex flex-col w-full bg-canvas-soft min-h-screen">
      {/* Sticky Header for Progress & Navigation */}
      <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b border-hairline px-4 md:px-8 py-3 flex items-center justify-between">
        <Link
          to={listPath}
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
                {evaluation.dueDate
                  ? `Due: ${new Date(evaluation.dueDate).toLocaleDateString(
                      "en-US",
                      { month: "short", day: "numeric", year: "numeric" },
                    )}`
                  : `${evaluation.schoolYear} · Term ${evaluation.term}`}
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
                Category {safeCategoryIndex + 1} of{" "}
                {categories.length}
              </span>
              <h2 className="text-xl font-bold text-foreground mt-1">
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
                key={question.questionId}
                className="shadow-sm border-hairline bg-card">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row md:items-start gap-6">
                    <div className="flex-1 space-y-2">
                      <p className="font-medium text-base text-foreground leading-relaxed">
                        <span className="text-muted-foreground mr-2">
                          {index + 1}.
                        </span>
                        {question.text}{" "}
                        <span className="text-destructive ml-1">*</span>
                      </p>
                    </div>
                    <div className="shrink-0 flex justify-center md:justify-end">
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

        {/* Footer Navigation */}
        <div className="flex items-center justify-between pt-6 border-t border-hairline mt-8">
          <Button
            variant="outline"
            onClick={handlePrev}
            disabled={safeCategoryIndex === 0 || isSubmitting}
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
