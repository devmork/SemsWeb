import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  useCategories,
  useCreateCategory,
  useDeleteCategory,
  useUpdateCategory,
} from "../hooks/useCategories";
import {
  useQuestions,
  useCreateQuestion,
  useUpdateQuestion,
  useDeleteQuestion,
} from "../hooks/useQuestions";
import type {
  Category,
  CreateCategoryInput,
  Question,
  CreateQuestionInput,
} from "../types";
import { CategoryDialog } from "./CategoryDialog";
import { DeleteCategoryDialog } from "./DeleteCategoryDialog";
import { QuestionDialog } from "./QuestionDialog";
import { DeleteQuestionDialog } from "./DeleteQuestionDialog";
import { IconEdit, IconTrash, IconPlus } from "@tabler/icons-react";

function mutationErrorMessage(error: unknown): string | null {
  if (!error) return null;
  if (typeof error === "object" && "response" in error) {
    const response = (error as { response?: { data?: { message?: string } } })
      .response;
    if (response?.data?.message) return response.data.message;
  }
  return "Something went wrong. Please try again.";
}

function CategoryCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-xl border border-hairline">
      <div className="space-y-3 p-4">
        <Skeleton className="h-5 w-full" />
        <Skeleton className="h-5 w-full" />
        <Skeleton className="h-5 w-3/4" />
      </div>
    </div>
  );
}

function CategoryQuestionPanel({ category }: { category: Category }) {
  const { data: questions = [], isLoading, error } = useQuestions(category.id);
  const {
    mutate: createQuestion,
    isPending: isCreating,
    error: createError,
    reset: resetCreateError,
  } = useCreateQuestion(category.id);
  const {
    mutate: updateQuestion,
    isPending: isUpdating,
    error: updateError,
    reset: resetUpdateError,
  } = useUpdateQuestion(category.id);
  const { mutate: deleteQuestion, isPending: isDeleting } = useDeleteQuestion(
    category.id,
  );

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
      updateQuestion({ qnNo: editingQuestion.id, input }, { onSuccess });
    } else {
      createQuestion(input, { onSuccess });
    }
  };

  const handleDeleteConfirm = (qnNo: number) => {
    deleteQuestion(qnNo, {
      onSuccess: () => {
        setDeleteDialogOpen(false);
        setDeletingQuestion(null);
      },
    });
  };

  return (
    <div className="flex flex-col gap-4 px-4 pb-4">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground">
          Manage the evaluation questions in this category.
        </p>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            setEditingQuestion(null);
            resetCreateError();
            resetUpdateError();
            setQuestionDialogOpen(true);
          }}>
          <IconPlus /> Add Question
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
        <CategoryCardSkeleton />
      ) : error ? (
        <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-hairline py-16 text-center">
          <p className="text-sm font-medium">Couldn't load questions</p>
          <p className="text-sm text-muted-foreground">
            Check your connection and try again.
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.location.reload()}>
            Retry
          </Button>
        </div>
      ) : filteredQuestions.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <p className="text-sm font-medium">No questions yet</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Add a question to start building this category.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-hairline">
          <table className="w-full min-w-[560px] text-left">
            <thead>
              <tr className="bg-canvas-soft">
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Question
                </th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredQuestions.map((question) => (
                <tr
                  key={question.id}
                  className="border-t border-hairline hover:bg-muted/40">
                  <td className="px-4 py-3 text-sm">{question.text}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        aria-label={`Edit question ${question.id}`}
                        onClick={() => {
                          setEditingQuestion(question);
                          resetCreateError();
                          resetUpdateError();
                          setQuestionDialogOpen(true);
                        }}>
                        <IconEdit />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        aria-label={`Delete question ${question.id}`}
                        className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                        onClick={() => {
                          setDeletingQuestion(question);
                          setDeleteDialogOpen(true);
                        }}>
                        <IconTrash />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
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

export function CategoryManagement() {
  const { data: categories = [], isLoading, error } = useCategories();
  const {
    mutate: createCategory,
    isPending: isCreating,
    error: createError,
    reset: resetCreateError,
  } = useCreateCategory();
  const {
    mutate: updateCategory,
    isPending: isUpdating,
    error: updateError,
    reset: resetUpdateError,
  } = useUpdateCategory();
  const { mutate: deleteCategory, isPending: isDeleting } = useDeleteCategory();

  const [categoryDialogOpen, setCategoryDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingCategory, setDeletingCategory] = useState<Category | null>(
    null,
  );
  const [query, setQuery] = useState("");
  const [openValues, setOpenValues] = useState<string[]>([]);

  const trimmedQuery = query.trim().toLowerCase();
  const filteredCategories = useMemo(
    () =>
      trimmedQuery
        ? categories.filter((c) => c.catName.toLowerCase().includes(trimmedQuery))
        : categories,
    [categories, trimmedQuery],
  );

  const submitError =
    mutationErrorMessage(createError) ?? mutationErrorMessage(updateError);

  const handleCategorySubmit = (input: CreateCategoryInput) => {
    const onSuccess = () => {
      setCategoryDialogOpen(false);
      setEditingCategory(null);
    };
    if (editingCategory) {
      updateCategory({ id: editingCategory.id, input }, { onSuccess });
    } else {
      createCategory(input, { onSuccess });
    }
  };

  const handleDeleteConfirm = (id: number) => {
    deleteCategory(id, {
      onSuccess: () => {
        setDeleteDialogOpen(false);
        setDeletingCategory(null);
      },
    });
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-lg font-semibold">Categories</h1>
        <Button
          onClick={() => {
            setEditingCategory(null);
            resetCreateError();
            resetUpdateError();
            setCategoryDialogOpen(true);
          }}>
          Add Category
        </Button>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search categories..."
          aria-label="Search categories"
          className="max-w-xs"
        />
      </div>

      {isLoading ? (
        <CategoryCardSkeleton />
      ) : error ? (
        <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-hairline py-16 text-center">
          <p className="text-sm font-medium">Couldn't load categories</p>
          <p className="text-sm text-muted-foreground">
            Check your connection and try again.
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.location.reload()}>
            Retry
          </Button>
        </div>
      ) : filteredCategories.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <p className="text-sm font-medium">No categories yet</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Create a category to start organizing questions.
          </p>
        </div>
      ) : (
        <Accordion
          multiple
          value={openValues}
          onValueChange={setOpenValues}
          className="flex flex-col gap-4">
          {filteredCategories.map((category) => (
            <Card key={category.id}>
              <AccordionItem
                value={String(category.id)}
                className="border-none">
                <CardHeader className="pb-0">
                  <div className="flex items-center justify-between gap-4">
                    <CardTitle>{category.catName}</CardTitle>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        aria-label={`Edit ${category.catName}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditingCategory(category);
                          resetCreateError();
                          resetUpdateError();
                          setCategoryDialogOpen(true);
                        }}>
                        <IconEdit />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        aria-label={`Delete ${category.catName}`}
                        className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                        onClick={(e) => {
                          e.stopPropagation();
                          setDeletingCategory(category);
                          setDeleteDialogOpen(true);
                        }}>
                        <IconTrash />
                      </Button>
                      <AccordionTrigger
                        className="py-1 px-2"
                        onClick={(e) => e.stopPropagation()}>
                        <span className="sr-only">Toggle questions</span>
                      </AccordionTrigger>
                    </div>
                  </div>
                </CardHeader>

                <AccordionContent className="px-4 pb-4">
                  <CategoryQuestionPanel category={category} />
                </AccordionContent>
              </AccordionItem>
            </Card>
          ))}
        </Accordion>
      )}

      <CategoryDialog
        open={categoryDialogOpen}
        onOpenChange={(open) => {
          setCategoryDialogOpen(open);
          if (!open) setEditingCategory(null);
        }}
        category={editingCategory}
        onSubmit={handleCategorySubmit}
        isPending={isCreating || isUpdating}
        submitError={submitError}
      />
      <DeleteCategoryDialog
        open={deleteDialogOpen}
        onOpenChange={(open) => {
          setDeleteDialogOpen(open);
          if (!open) setDeletingCategory(null);
        }}
        category={deletingCategory}
        onConfirm={handleDeleteConfirm}
        isPending={isDeleting}
      />
    </div>
  );
}
