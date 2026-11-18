import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useParams } from "@tanstack/react-router";
import {
  useCreateQuestion,
  useDeleteQuestion,
  useQuestions,
  useUpdateQuestion,
} from "../hooks/useQuestions";
import type { Question, CreateQuestionInput } from "../types";
import { QuestionDialog } from "./QuestionDialog";
import { QuestionTable } from "./QuestionTable";
import { DeleteQuestionDialog } from "./DeleteQuestionDialog";

interface QuestionManagementProps {
  categoryId?: number;
  categoryName?: string;
}

function mutationErrorMessage(error: unknown): string | null {
  if (!error) return null;
  if (typeof error === "object" && "response" in error) {
    const response = (
      error as { response?: { data?: { message?: string } } }
    ).response;
    if (response?.data?.message) return response.data.message;
  }
  return "Something went wrong. Please try again.";
}

function QuestionTableSkeleton() {
  return (
    <div className="overflow-hidden rounded-xl border border-hairline">
      <div className="space-y-3 p-4">
        <Skeleton className="h-5 w-full" />
        <Skeleton className="h-5 w-full" />
      </div>
    </div>
  );
}

export function QuestionManagement({
  categoryId,
  categoryName,
}: QuestionManagementProps) {
  const { categoryId: paramCategoryId } = useParams({
    from: "/_authenticated/qa/questions/$categoryId",
  });
  const resolvedCategoryId = Number(paramCategoryId) || categoryId || 0;
  const { data: questions = [], isLoading, error } = useQuestions(resolvedCategoryId);
  const {
    mutate: createQuestion,
    isPending: isCreating,
    error: createError,
    reset: resetCreateError,
  } = useCreateQuestion(resolvedCategoryId);
  const {
    mutate: updateQuestion,
    isPending: isUpdating,
    error: updateError,
    reset: resetUpdateError,
  } = useUpdateQuestion(resolvedCategoryId);
  const { mutate: deleteQuestion, isPending: isDeleting } =
    useDeleteQuestion(resolvedCategoryId);

  const [questionDialogOpen, setQuestionDialogOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingQuestion, setDeletingQuestion] = useState<Question | null>(
    null,
  );
  const [query, setQuery] = useState("");

  const trimmedQuery = query.trim().toLowerCase();
  const filteredQuestions = useMemo(
    () =>
      trimmedQuery
        ? questions.filter((q) => q.text.toLowerCase().includes(trimmedQuery))
        : questions,
    [questions, trimmedQuery],
  );

  const submitError =
    mutationErrorMessage(createError) ?? mutationErrorMessage(updateError);

  const handleQuestionSubmit = (input: CreateQuestionInput) => {
    const onSuccess = () => {
      setQuestionDialogOpen(false);
      setEditingQuestion(null);
    };
    if (editingQuestion) {
      updateQuestion(
        { questionId: editingQuestion.id, input },
        { onSuccess },
      );
    } else {
      createQuestion(input, { onSuccess });
    }
  };

  const handleDeleteConfirm = (questionId: number) => {
    deleteQuestion(questionId, {
      onSuccess: () => {
        setDeleteDialogOpen(false);
        setDeletingQuestion(null);
      },
    });
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-lg font-semibold">
            Questions — {categoryName ?? resolvedCategoryId}
          </h1>
          <p className="text-sm text-muted-foreground">
            Manage the evaluation questions in this category.
          </p>
        </div>
        <Button
          onClick={() => {
            setEditingQuestion(null);
            resetCreateError();
            resetUpdateError();
            setQuestionDialogOpen(true);
          }}
        >
          Add Question
        </Button>
      </div>

      <div className="flex items-center gap-3">
        <Input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search questions..."
          aria-label="Search questions"
          className="max-w-xs"
        />
      </div>

      {isLoading ? (
        <QuestionTableSkeleton />
      ) : error ? (
        <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-hairline py-16 text-center">
          <p className="text-sm font-medium">Couldn't load questions</p>
          <p className="text-sm text-muted-foreground">
            Check your connection and try again.
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.location.reload()}
          >
            Retry
          </Button>
        </div>
      ) : (
        <QuestionTable
          questions={filteredQuestions}
          onEdit={(question) => {
            setEditingQuestion(question);
            resetCreateError();
            resetUpdateError();
            setQuestionDialogOpen(true);
          }}
          onDelete={(question) => {
            setDeletingQuestion(question);
            setDeleteDialogOpen(true);
          }}
        />
      )}
      <QuestionDialog
        open={questionDialogOpen}
        onOpenChange={(open) => {
          setQuestionDialogOpen(open);
          if (!open) setEditingQuestion(null);
        }}
        question={editingQuestion}
        onSubmit={handleQuestionSubmit}
        isPending={isCreating || isUpdating}
        submitError={submitError}
      />
      <DeleteQuestionDialog
        open={deleteDialogOpen}
        onOpenChange={(open) => {
          setDeleteDialogOpen(open);
          if (!open) setDeletingQuestion(null);
        }}
        question={deletingQuestion}
        onConfirm={handleDeleteConfirm}
        isPending={isDeleting}
      />
    </div>
  );
}
