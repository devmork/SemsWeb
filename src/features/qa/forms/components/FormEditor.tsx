import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { cn } from "@/shared/lib/utils";
import {
  IconArrowLeft,
  IconCheck,
  IconPencil,
  IconPlus,
  IconTrash,
  IconX,
} from "@tabler/icons-react";
import { useForm as useRHF, useWatch } from "react-hook-form";
import {
  useForm as useFormData,
  useCreateForm,
  useUpdateForm,
  useEvaluationTypes,
  useCategoriesByType,
} from "../hooks/useForms";
import {
  formCategoryKeys,
  useFormCategories,
  useCreateFormCategory,
  useDeleteFormCategory,
} from "../hooks/useFormCategories";
import {
  useFormQuestions,
  useCreateFormQuestion,
  useUpdateFormQuestion,
  useDeleteFormQuestion,
} from "../hooks/useFormQuestions";
import type {
  CategoryOption,
  CreateFormInput,
  FormCategory,
  FormQuestion,
} from "../types";

const TEXTAREA_CLASS =
  "w-full rounded-md border border-input bg-transparent px-2.5 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30 md:text-sm";

function mutationErrorMessage(error: unknown): string {
  if (typeof error === "object" && error !== null && "response" in error) {
    const response = (error as { response?: { data?: { message?: string } } })
      .response;
    if (response?.data?.message) return response.data.message;
  }
  return "Something went wrong. Please try again.";
}

interface FormValues {
  title: string;
  description: string;
  evaluationTypeId: string;
}

interface FormPayload {
  evaluationTypeId: number;
  title: string;
  description: string | undefined;
}

function toPayload(values: FormValues): FormPayload {
  return {
    evaluationTypeId: Number(values.evaluationTypeId),
    title: values.title.trim(),
    description: values.description.trim() || undefined,
  };
}

export function FormEditor({
  formId,
}: {
  formId?: number | undefined;
  /** Kept for route compatibility; layout shows all sections at once. */
  initialStep?: number | undefined;
}) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [createdFormId, setCreatedFormId] = useState<number | null>(null);
  const activeFormId = formId ?? createdFormId;
  const isEditRoute = formId !== undefined;
  const hasForm = activeFormId !== null;

  const formQuery = useFormData(activeFormId ?? 0);
  const form = formQuery.data;
  const formLoading = isEditRoute && formQuery.isLoading;

  const { data: evaluationTypes = [] } = useEvaluationTypes();
  const createForm = useCreateForm();
  const updateForm = useUpdateForm();

  const {
    register,
    handleSubmit,
    reset,
    getValues,
    control,
    formState: { errors },
  } = useRHF<FormValues>({
    defaultValues: {
      title: "",
      description: "",
      evaluationTypeId: "",
    },
  });

  const evaluationTypeIdStr = useWatch({ control, name: "evaluationTypeId" });
  const evaluationTypeId = Number(evaluationTypeIdStr || 0);
  const { data: allCategories = [], isLoading: categoriesLoading } =
    useCategoriesByType(evaluationTypeId);

  const { data: linked = [], isLoading: linkedLoading } = useFormCategories(
    activeFormId ?? 0,
  );
  const addCat = useCreateFormCategory();
  const deleteCat = useDeleteFormCategory();

  // Prevent duplicate add/remove requests for the same category on rapid clicks.
  const pendingCategoryOps = useRef<Set<number>>(new Set());

  // Hydrate the form when an existing form loads. The form query only changes
  // identity after a save/invalidation, so this never clobbers mid-edit input.
  useEffect(() => {
    if (isEditRoute && form) {
      reset({
        title: form.title,
        description: form.description ?? "",
        evaluationTypeId: String(form.evaluationTypeId),
      });
    }
  }, [isEditRoute, form, reset]);

  const [stepError, setStepError] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [questionCounts, setQuestionCounts] = useState<Record<number, number>>(
    {},
  );

  const reportCount = useCallback((categoryId: number, count: number) => {
    setQuestionCounts((prev) =>
      prev[categoryId] === count ? prev : { ...prev, [categoryId]: count },
    );
  }, []);

  const typeName =
    evaluationTypes.find((t) => t.evaluationTypeId === evaluationTypeId)
      ?.evaluationTypeName ?? "selected evaluation type";

  const selectedWeight = linked.reduce(
    (sum, fc) => sum + (fc.categoryRate ?? 0),
    0,
  );
  const allSelected =
    allCategories.length > 0 &&
    allCategories.every((c) =>
      linked.some((fc) => fc.categoryId === c.categoryId),
    );

  const totalQuestions = linked.reduce(
    (sum, fc) => sum + (questionCounts[fc.categoryId] ?? 0),
    0,
  );
  const countsReady = linked.every(
    (fc) => questionCounts[fc.categoryId] !== undefined,
  );
  const missingQuestions = linked.filter(
    (fc) => (questionCounts[fc.categoryId] ?? 0) === 0,
  );
  const canActivate =
    !!form &&
    linked.length > 0 &&
    countsReady &&
    missingQuestions.length === 0;
  const activationHint = !form
    ? "Loading form…"
    : linked.length === 0
      ? "Add at least one category before activating."
      : !countsReady
        ? "Checking existing questions…"
        : missingQuestions.length > 0
          ? `Add at least one question to: ${missingQuestions
              .map((fc) => fc.categoryName ?? `Category ${fc.categoryId}`)
              .join(", ")}.`
          : "";

  const submitStep1 = handleSubmit(async (values) => {
    setStepError(null);
    setStatusMessage(null);
    try {
      if (activeFormId) {
        await updateForm.mutateAsync({
          id: activeFormId,
          input: toPayload(values),
        });
        setStatusMessage("Form details saved.");
      } else {
        const input: CreateFormInput = {
          ...toPayload(values),
          isActive: 0,
        };
        const created = await createForm.mutateAsync(input);
        setCreatedFormId(created.formId);
        setStatusMessage("Form created. You can now select categories.");
      }
    } catch (error) {
      setStepError(mutationErrorMessage(error));
    }
  });

  const toggleCategory = (category: CategoryOption) => {
    if (!activeFormId) return;
    setStepError(null);

    const categoryId = category.categoryId;
    if (pendingCategoryOps.current.has(categoryId)) return;

    const existing = linked.find((fc) => fc.categoryId === categoryId);
    const listKey = formCategoryKeys.list(activeFormId);

    pendingCategoryOps.current.add(categoryId);
    const release = () => {
      pendingCategoryOps.current.delete(categoryId);
    };

    if (existing) {
      deleteCat.mutate(
        { formId: activeFormId, formCategoryId: existing.formCategoryId },
        {
          onSuccess: () =>
            queryClient.setQueryData<FormCategory[]>(listKey, (old = []) =>
              old.filter((fc) => fc.formCategoryId !== existing.formCategoryId),
            ),
          onError: (error) => setStepError(mutationErrorMessage(error)),
          onSettled: release,
        },
      );
    } else {
      addCat.mutate(
        {
          formId: activeFormId,
          categoryId,
          isActive: true,
        },
        {
          onSuccess: (created) =>
            queryClient.setQueryData<FormCategory[]>(listKey, (old = []) =>
              old.some(
                (fc) =>
                  fc.categoryId === created.categoryId ||
                  fc.formCategoryId === created.formCategoryId,
              )
                ? old
                : [...old, created],
            ),
          onError: (error) => setStepError(mutationErrorMessage(error)),
          onSettled: release,
        },
      );
    }
  };

  const selectAll = () => {
    if (!activeFormId) return;
    setStepError(null);
    const listKey = formCategoryKeys.list(activeFormId);
    allCategories
      .filter(
        (c) =>
          !linked.some((fc) => fc.categoryId === c.categoryId) &&
          !pendingCategoryOps.current.has(c.categoryId),
      )
      .forEach((c) => {
        const categoryId = c.categoryId;
        pendingCategoryOps.current.add(categoryId);
        const release = () => {
          pendingCategoryOps.current.delete(categoryId);
        };
        addCat.mutate(
          { formId: activeFormId, categoryId, isActive: true },
          {
            onSuccess: (created) =>
              queryClient.setQueryData<FormCategory[]>(listKey, (old = []) =>
                old.some(
                  (fc) =>
                    fc.categoryId === created.categoryId ||
                    fc.formCategoryId === created.formCategoryId,
                )
                  ? old
                  : [...old, created],
              ),
            onError: (error) => setStepError(mutationErrorMessage(error)),
            onSettled: release,
          },
        );
      });
  };

  const setFormStatus = async (isActive: 0 | 1) => {
    if (!activeFormId || !form) return;
    setStepError(null);
    setStatusMessage(null);
    const values = getValues();
    try {
      await updateForm.mutateAsync({
        id: activeFormId,
        input: {
          ...toPayload(values),
          isActive,
        },
      });
      setStatusMessage(
        isActive === 1
          ? "Form activated — evaluation sessions can now use it."
          : "Form deactivated — it is back to draft.",
      );
    } catch (error) {
      setStepError(mutationErrorMessage(error));
    }
  };

  if (isEditRoute && formQuery.isError) {
    return (
      <div className="flex w-full flex-col gap-4">
        <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-border bg-card py-16 text-center shadow-sm">
          <p className="text-sm font-medium">Couldn't load this form</p>
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
      </div>
    );
  }

  return (
    <div className="flex w-full min-w-0 flex-col gap-6">
      <header className="flex flex-wrap items-start gap-3">
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={() => navigate({ to: "/qa/forms" })}
          aria-label="Back to forms"
        >
          <IconArrowLeft />
        </Button>
        <div className="min-w-0 flex-1">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            {isEditRoute ? "Edit Form" : "New Form"}
          </h1>
          <p className="text-sm break-words text-muted-foreground">
            Set the form details, choose the categories for its evaluation type,
            then add questions under each category.
          </p>
        </div>
        {form && (
          <Badge
            className="ml-auto shrink-0"
            variant={form.isActive === 1 ? "default" : "outline"}>
            {form.isActive === 1 ? "Active" : "Draft"}
          </Badge>
        )}
      </header>

      {stepError && (
        <p
          role="alert"
          className="rounded-lg border border-destructive/20 bg-destructive/5 px-3 py-2 text-sm text-destructive"
        >
          {stepError}
        </p>
      )}
      {statusMessage && !stepError && (
        <p className="rounded-lg border border-success/20 bg-success/10 px-3 py-2 text-sm text-success">
          {statusMessage}
        </p>
      )}

      {formLoading ? (
        <div className="flex flex-col gap-3">
          <Skeleton className="h-48 w-full rounded-xl" />
          <Skeleton className="h-40 w-full rounded-xl" />
        </div>
      ) : (
        <>
          {/* Step 1: Basic info */}
          <section className="min-w-0 rounded-xl border border-border bg-card p-5 shadow-sm">
            <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
              <div>
                <h2 className="text-base font-semibold text-foreground">
                  Evaluation Form Details
                </h2>
                <p className="mt-1 text-xs text-muted-foreground">
                  The evaluation type decides which shared categories you can
                  pick below.
                </p>
              </div>
              {hasForm && (
                <span className="text-xs text-muted-foreground">
                  Form ID: {activeFormId}
                </span>
              )}
            </div>

            <form
              onSubmit={submitStep1}
              className="grid min-w-0 grid-cols-[minmax(0,1fr)] gap-4 sm:grid-cols-2"
              noValidate
            >
              <div className="flex min-w-0 flex-col gap-1.5">
                <label
                  className="text-xs font-medium text-muted-foreground"
                  htmlFor="form-title"
                >
                  FORM TITLE
                </label>
                <Input
                  id="form-title"
                  placeholder="Preschool – Grade 3 Teacher Evaluation"
                  aria-invalid={errors.title ? true : undefined}
                  {...register("title", { required: "Title is required" })}
                />
                {errors.title && (
                  <p className="text-xs text-destructive">
                    {errors.title.message}
                  </p>
                )}
              </div>

              <div className="flex min-w-0 flex-col gap-1.5">
                <label
                  className="text-xs font-medium text-muted-foreground"
                  htmlFor="form-eval-type"
                >
                  EVALUATION TYPE
                </label>
                <select
                  id="form-eval-type"
                  className="h-9 w-full min-w-0 rounded-md border border-input bg-transparent px-2.5 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                  aria-invalid={errors.evaluationTypeId ? true : undefined}
                  {...register("evaluationTypeId", {
                    required: "Evaluation type is required",
                  })}
                >
                  <option value="">Select…</option>
                  {evaluationTypes.map((t) => (
                    <option key={t.evaluationTypeId} value={t.evaluationTypeId}>
                      {t.evaluationTypeName}
                    </option>
                  ))}
                </select>
                {errors.evaluationTypeId && (
                  <p className="text-xs text-destructive">
                    {errors.evaluationTypeId.message}
                  </p>
                )}
              </div>

              <div className="flex min-w-0 flex-col gap-1.5 sm:col-span-2">
                <label
                  className="text-xs font-medium text-muted-foreground"
                  htmlFor="form-description"
                >
                  DESCRIPTION &amp; INSTRUCTIONS
                </label>
                <textarea
                  id="form-description"
                  rows={3}
                  placeholder="Optional instructions shown to respondents"
                  className={TEXTAREA_CLASS}
                  {...register("description")}
                />
              </div>

              <div className="flex justify-end gap-2 sm:col-span-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate({ to: "/qa/forms" })}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={createForm.isPending || updateForm.isPending}
                >
                  {hasForm
                    ? updateForm.isPending
                      ? "Saving…"
                      : "Save details"
                    : createForm.isPending
                      ? "Creating…"
                      : "Create form"}
                </Button>
              </div>
            </form>
          </section>

          {/* Steps 2 & 3: categories + questions */}
          <div className="grid min-w-0 gap-6 xl:grid-cols-[minmax(320px,420px)_1fr] xl:items-start">
            {/* Step 2: Categories */}
            <section className="min-w-0 rounded-xl border border-border bg-card p-5 shadow-sm">
              <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h2 className="text-base font-semibold text-foreground">
                    Select Categories
                  </h2>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {evaluationTypeId > 0
                      ? `Choose which shared ${typeName} categories belong to this form.`
                      : "Choose an evaluation type above to see available categories."}
                  </p>
                </div>
                {hasForm && evaluationTypeId > 0 && (
                  <div className="flex items-center gap-2">
                    <span className="rounded-full bg-muted px-2.5 py-1 text-xs font-medium tabular-nums text-muted-foreground">
                      Selected weight: {selectedWeight}%
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={selectAll}
                      disabled={
                        allCategories.length === 0 ||
                        allSelected ||
                        addCat.isPending
                      }
                    >
                      Select all
                    </Button>
                  </div>
                )}
              </div>

              {!hasForm ? (
                <div className="rounded-lg border border-dashed border-border px-4 py-8 text-center">
                  <p className="text-sm text-muted-foreground">
                    Create the form first to select categories.
                  </p>
                </div>
              ) : evaluationTypeId === 0 ? (
                <div className="rounded-lg border border-dashed border-border px-4 py-8 text-center">
                  <p className="text-sm text-muted-foreground">
                    Select an evaluation type in the form details to load
                    categories.
                  </p>
                </div>
              ) : linkedLoading || categoriesLoading ? (
                <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <Skeleton key={i} className="h-16 w-full rounded-lg" />
                  ))}
                </div>
              ) : allCategories.length === 0 ? (
                <div className="flex flex-col items-center gap-3 rounded-lg border border-dashed border-border px-4 py-8 text-center">
                  <p className="text-sm text-muted-foreground">
                    No shared categories exist for this evaluation type yet. An
                    administrator can add them.
                  </p>
                </div>
              ) : (
                <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
                  {allCategories.map((cat) => (
                    <CategoryCard
                      key={cat.categoryId}
                      category={cat}
                      checked={linked.some(
                        (fc) => fc.categoryId === cat.categoryId,
                      )}
                      onToggle={() => toggleCategory(cat)}
                    />
                  ))}
                </div>
              )}
            </section>

            {/* Step 3: Questions */}
            <section className="min-w-0 rounded-xl border border-border bg-card p-5 shadow-sm">
              <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h2 className="text-base font-semibold text-foreground">
                    Author Questions
                  </h2>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Questions belong to this form only — editing here never
                    affects other forms.
                  </p>
                </div>
                {hasForm && (
                  <span className="rounded-full bg-muted px-2.5 py-1 text-xs font-medium tabular-nums text-muted-foreground">
                    {totalQuestions} question{totalQuestions === 1 ? "" : "s"}
                  </span>
                )}
              </div>

              {!hasForm ? (
                <div className="rounded-lg border border-dashed border-border px-4 py-8 text-center">
                  <p className="text-sm text-muted-foreground">
                    Create the form and select categories to start adding
                    questions.
                  </p>
                </div>
              ) : linkedLoading ? (
                <Skeleton className="h-24 w-full rounded-lg" />
              ) : linked.length === 0 ? (
                <div className="rounded-lg border border-dashed border-border px-4 py-8 text-center">
                  <p className="text-sm text-muted-foreground">
                    Select one or more categories to author questions for them.
                  </p>
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  {linked.map((fc) => (
                    <CategoryQuestionsBlock
                      key={fc.formCategoryId}
                      formId={activeFormId!}
                      formCategory={fc}
                      onCountChange={reportCount}
                    />
                  ))}
                </div>
              )}

              {hasForm && (
                <>
                  <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-4">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-sm font-medium text-foreground">
                        Status
                      </span>
                      <Badge
                        variant={form?.isActive === 1 ? "default" : "outline"}
                      >
                        {form?.isActive === 1 ? "Active" : "Draft"}
                      </Badge>
                    </div>
                    {form?.isActive === 1 ? (
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={updateForm.isPending}
                        onClick={() => void setFormStatus(0)}
                      >
                        Deactivate
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        disabled={!canActivate || updateForm.isPending}
                        onClick={() => void setFormStatus(1)}
                      >
                        {updateForm.isPending ? "Working…" : "Activate form"}
                      </Button>
                    )}
                  </div>
                  {form?.isActive !== 1 && activationHint && (
                    <p className="mt-2 text-xs text-muted-foreground">
                      {activationHint}
                    </p>
                  )}
                </>
              )}
            </section>
          </div>
        </>
      )}
    </div>
  );
}

function CategoryCard({
  category,
  checked,
  onToggle,
}: {
  category: CategoryOption;
  checked: boolean;
  onToggle: () => void;
}) {
  return (
    <label
      className={cn(
        "cursor-pointer rounded-lg border p-3 transition-colors",
        checked
          ? "border-primary bg-primary/5"
          : "border-border hover:bg-muted/40",
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-start gap-2.5">
          <input
            type="checkbox"
            className="mt-0.5 size-4 accent-primary"
            checked={checked}
            onChange={onToggle}
          />
          <span className="flex min-w-0 flex-col">
            <span className="text-sm font-medium break-words text-foreground">
              {category.categoryName ?? `Category ${category.categoryId}`}
            </span>
            <span className="text-xs text-muted-foreground">
              Shared category
            </span>
          </span>
        </div>
        <span className="shrink-0 rounded-full bg-muted px-2 py-0.5 text-xs font-medium tabular-nums text-muted-foreground">
          {category.categoryRate ?? 0}%
        </span>
      </div>
      {checked && (
        <p className="mt-2 flex items-center gap-1 text-xs font-medium text-brand-accent">
          <IconCheck className="size-3" /> Included
        </p>
      )}
    </label>
  );
}

/**
 * One question row. Kept at module scope so editing one row never remounts the
 * others (and the input keeps focus while typing).
 */
function QuestionRow({
  formId,
  categoryId,
  question,
  onError,
}: {
  formId: number;
  categoryId: number;
  question: FormQuestion;
  onError: (message: string) => void;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(question.questionName ?? "");
  const [fieldError, setFieldError] = useState<string | null>(null);
  const updateQ = useUpdateFormQuestion();
  const deleteQ = useDeleteFormQuestion();
  const inputId = `question-${question.formQuestionId}`;

  const startEditing = () => {
    setDraft(question.questionName ?? "");
    setFieldError(null);
    setIsEditing(true);
  };

  const cancelEditing = () => {
    setDraft(question.questionName ?? "");
    setFieldError(null);
    setIsEditing(false);
  };

  const save = () => {
    const text = draft.trim();
    if (!text) {
      setFieldError("Question text is required.");
      return;
    }
    setFieldError(null);
    updateQ.mutate(
      {
        formId,
        categoryId,
        questionId: question.formQuestionId,
        input: {
          formQuestionId: question.formQuestionId,
          questionName: text,
          displayOrder: question.displayOrder,
          ...(question.points !== null ? { points: question.points } : {}),
        },
      },
      {
        onSuccess: () => setIsEditing(false),
        onError: (error) => {
          const message = mutationErrorMessage(error);
          setFieldError(message);
          onError(message);
        },
      },
    );
  };

  if (isEditing) {
    return (
      <li className="rounded-md border border-brand-accent bg-card p-3">
        <Field data-invalid={!!fieldError}>
          <FieldLabel htmlFor={inputId} className="sr-only">
            Edit question text
          </FieldLabel>
          <Input
            id={inputId}
            value={draft}
            autoFocus
            aria-invalid={fieldError ? true : undefined}
            aria-describedby={fieldError ? `${inputId}-error` : undefined}
            onChange={(event) => setDraft(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                save();
              }
              if (event.key === "Escape") {
                event.preventDefault();
                cancelEditing();
              }
            }}
            className="min-w-0"
          />
          {fieldError ? (
            <FieldError id={`${inputId}-error`}>{fieldError}</FieldError>
          ) : null}
        </Field>
        <div className="mt-2 flex flex-wrap gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="min-h-11 sm:min-h-8"
            onClick={cancelEditing}
            disabled={updateQ.isPending}>
            <IconX data-icon="inline-start" aria-hidden="true" /> Cancel
          </Button>
          <Button
            type="button"
            size="sm"
            className="min-h-11 sm:min-h-8"
            onClick={save}
            disabled={updateQ.isPending}>
            <IconCheck data-icon="inline-start" aria-hidden="true" /> Save
            question
          </Button>
        </div>
      </li>
    );
  }

  return (
    <li className="flex flex-col items-start gap-2 rounded-md border border-border bg-muted/40 px-3 py-2 sm:flex-row sm:items-center sm:justify-between">
      <span className="min-w-0 break-words text-sm text-foreground">
        {question.questionName}
      </span>
      <span className="flex w-full shrink-0 items-center justify-end gap-1 sm:w-auto">
        <Button
          variant="ghost"
          size="icon-sm"
          className="min-h-11 min-w-11 text-brand-accent hover:bg-brand-accent/10 hover:text-brand-accent sm:min-h-8 sm:min-w-8"
          aria-label={`Edit ${question.questionName}`}
          onClick={startEditing}>
          <IconPencil aria-hidden="true" />
        </Button>
        <Button
          variant="ghost"
          size="icon-sm"
          className="min-h-11 min-w-11 text-destructive hover:bg-destructive/10 hover:text-destructive sm:min-h-8 sm:min-w-8"
          aria-label={`Delete ${question.questionName}`}
          onClick={() =>
            deleteQ.mutate(
              {
                formId,
                categoryId,
                questionId: question.formQuestionId,
              },
              {
                onError: (error) => onError(mutationErrorMessage(error)),
              },
            )
          }>
          <IconTrash aria-hidden="true" />
        </Button>
      </span>
    </li>
  );
}

function CategoryQuestionsBlock({
  formId,
  formCategory,
  onCountChange,
}: {
  formId: number;
  formCategory: FormCategory;
  onCountChange: (categoryId: number, count: number) => void;
}) {
  const { data: questions = [], isLoading } = useFormQuestions(
    formId,
    formCategory.categoryId,
  );
  const createQ = useCreateFormQuestion();
  const [newQuestion, setNewQuestion] = useState("");
  const [questionError, setQuestionError] = useState<string | null>(null);

  useEffect(() => {
    if (isLoading) return;
    onCountChange(formCategory.categoryId, questions.length);
  }, [
    formCategory.categoryId,
    isLoading,
    onCountChange,
    questions.length,
  ]);

  const handleAdd = () => {
    const text = newQuestion.trim();
    if (!text) return;
    setQuestionError(null);
    createQ.mutate(
      {
        formId,
        categoryId: formCategory.categoryId,
        input: {
          formCategoryId: formCategory.formCategoryId,
          questionName: text,
        },
      },
      {
        onSuccess: () => setNewQuestion(""),
        onError: (error) => setQuestionError(mutationErrorMessage(error)),
      },
    );
  };

  return (
    <div className="rounded-lg border border-border">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-4 py-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm font-medium text-foreground">
            {formCategory.categoryName ??
              `Category ${formCategory.categoryId}`}
          </span>
          <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-medium tabular-nums text-muted-foreground">
            {formCategory.categoryRate ?? 0}%
          </span>
          <span className="rounded-full bg-muted px-2 py-0.5 text-xs tabular-nums text-muted-foreground">
            {questions.length} question{questions.length === 1 ? "" : "s"}
          </span>
        </div>
        <span className="text-xs text-muted-foreground">
          Order {formCategory.displayOrder}
        </span>
      </div>

      <div className="flex flex-col gap-2 px-4 py-3">
        {isLoading ? (
          <Skeleton className="h-8 w-full" />
        ) : questions.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No questions yet — add the first one below.
          </p>
        ) : (
          <ul className="flex flex-col gap-2">
            {questions.map((question: FormQuestion) => (
              <QuestionRow
                key={question.formQuestionId}
                formId={formId}
                categoryId={formCategory.categoryId}
                question={question}
                onError={setQuestionError}
              />
            ))}
          </ul>
        )}

        {questionError && (
          <p role="alert" className="text-xs text-destructive">
            {questionError}
          </p>
        )}

        <div className="flex flex-col gap-2 sm:flex-row">
          <Input
            value={newQuestion}
            onChange={(e) => setNewQuestion(e.target.value)}
            placeholder="Add a question…"
            className="min-w-0 flex-1"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleAdd();
              }
            }}
          />
          <Button
            size="sm"
            className="w-full shrink-0 sm:w-auto"
            onClick={handleAdd}
            disabled={!newQuestion.trim() || createQ.isPending}
          >
            <IconPlus /> Add question
          </Button>
        </div>
      </div>
    </div>
  );
}
