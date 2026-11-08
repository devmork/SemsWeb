import { useEffect, useMemo, useState } from "react";
import { useForm, Controller, useWatch } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  useCategoriesByType,
  useEvaluationTypes,
  useQuestionsFor,
} from "../hooks/useForms";
import type { CategoryOption, Form, CreateFormInput } from "../types";
import { PROGRAM_OPTIONS, TARGET_TYPES } from "../types";

interface FormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  form?: Form | null;
  onSubmit: (input: CreateFormInput) => void;
  isPending?: boolean;
  submitError?: string | null;
}

interface FormValues {
  code: string;
  title: string;
  description: string;
  evaluationTypeId: string;
  gradeBand: string;
  targetType: string;
  programId: string;
  isActive: boolean;
}

function CategoryPreviewRow({
  category,
  checked,
  onToggle,
  disabled,
}: {
  category: CategoryOption;
  checked: boolean;
  onToggle: () => void;
  disabled: boolean;
}) {
  const { data: questions = [] } = useQuestionsFor(category.catNo);
  const noQuestions = questions.length === 0;
  return (
    <label
      className="flex items-start gap-2.5 rounded-md border border-hairline px-3 py-2 text-sm"
    >
      <input
        type="checkbox"
        className="mt-0.5 size-4 accent-primary"
        checked={checked}
        onChange={onToggle}
        disabled={disabled}
      />
      <span className="flex flex-1 flex-col">
        <span className="font-medium">
          {category.catName ?? `Category ${category.catNo}`}
        </span>
        <span className="text-xs text-muted-foreground">
          {questions.length} question{questions.length === 1 ? "" : "s"}
        </span>
        {noQuestions ? (
          <span className="text-xs font-medium text-destructive">
            Has no questions — forms with empty categories are rejected.
          </span>
        ) : null}
      </span>
    </label>
  );
}

export function FormDialog({
  open,
  onOpenChange,
  form = null,
  onSubmit,
  isPending = false,
  submitError = null,
}: FormDialogProps) {
  const isEdit = !!form;
  const { data: evaluationTypes = [] } = useEvaluationTypes();

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      code: "",
      title: "",
      description: "",
      evaluationTypeId: "",
      gradeBand: "",
      targetType: "SubjectTeacher",
      programId: "0",
      isActive: true,
    },
  });

  const evaluationTypeIdStr = useWatch({ control, name: "evaluationTypeId" });
  const evaluationTypeId = Number(evaluationTypeIdStr || 0);
  const { data: categories = [] } = useCategoriesByType(evaluationTypeId);

  const [uncheckedCats, setUncheckedCats] = useState<Set<number>>(new Set());

  const selectedCount = useMemo(
    () => categories.filter((c) => !uncheckedCats.has(c.catNo)).length,
    [categories, uncheckedCats],
  );

  useEffect(() => {
    if (open) {
      reset(
        form
          ? {
              code: form.code,
              title: form.title,
              description: form.description ?? "",
              evaluationTypeId: String(form.evaluationTypeId),
              gradeBand: form.gradeBand ?? "",
              targetType: form.targetType,
              programId: String(form.programId),
              isActive: form.isActive === 1,
            }
          : {
              code: "",
              title: "",
              description: "",
              evaluationTypeId: "",
              gradeBand: "",
              targetType: "SubjectTeacher",
              programId: "0",
              isActive: true,
            },
      );
    }
  }, [open, form, reset]);

  const onFormSubmit = (values: FormValues) => {
    onSubmit({
      code: values.code.trim(),
      title: values.title.trim(),
      description: values.description.trim() || undefined,
      evaluationTypeId: Number(values.evaluationTypeId),
      gradeBand: values.gradeBand.trim() || undefined,
      targetType: values.targetType,
      programId: Number(values.programId),
      isActive: values.isActive ? 1 : 0,
    });
    // Dialog stays open on failure — parent closes it via onOpenChange(false)
    // only in mutation onSuccess. Closing here would lose form data on error.
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit Form" : "Add Form"}</DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Update the form template details."
              : "Create a form template by pairing an evaluation type with a title and code."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onFormSubmit)} noValidate>
          <FieldGroup>
            <Field data-invalid={!!errors.code}>
              <FieldLabel htmlFor="form-code">Code</FieldLabel>
              <Input
                id="form-code"
                placeholder="e.g. PRE-G3"
                autoFocus
                disabled={isPending}
                {...register("code", {
                  required: "Code is required",
                  maxLength: { value: 20, message: "Code must be at most 20 characters" },
                })}
              />
              <p className="text-xs text-muted-foreground">
                Short unique code, e.g. PRE-G3
              </p>
              <FieldError errors={[errors.code]} />
            </Field>

            <Field data-invalid={!!errors.title}>
              <FieldLabel htmlFor="form-title">Title</FieldLabel>
              <Input
                id="form-title"
                placeholder="e.g. Preschool – Grade 3 Evaluation"
                disabled={isPending}
                {...register("title", {
                  required: "Title is required",
                  maxLength: { value: 200, message: "Title must be at most 200 characters" },
                })}
              />
              <FieldError errors={[errors.title]} />
            </Field>

            <Field data-invalid={!!errors.description}>
              <FieldLabel htmlFor="form-description">Description</FieldLabel>
              <textarea
                id="form-description"
                rows={3}
                className="flex w-full min-w-0 rounded-md border border-input bg-transparent px-2.5 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive md:text-sm dark:bg-input/30"
                placeholder="Optional description"
                disabled={isPending}
                {...register("description", {
                  maxLength: { value: 1000, message: "Description must be at most 1000 characters" },
                })}
              />
              <FieldError errors={[errors.description]} />
            </Field>

            <Field data-invalid={!!errors.evaluationTypeId}>
              <FieldLabel htmlFor="form-evaluation-type">Evaluation Type</FieldLabel>
              <Controller
                name="evaluationTypeId"
                control={control}
                rules={{
                  required: "Evaluation type is required",
                  validate: (v) => Number(v) > 0 || "Evaluation type is required",
                }}
                render={({ field }) => (
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                    disabled={isPending}
                  >
                    <SelectTrigger id="form-evaluation-type" className="w-full">
                      <SelectValue placeholder="Select evaluation type" />
                    </SelectTrigger>
                    <SelectContent>
                      {evaluationTypes.map((t) => (
                        <SelectItem
                          key={t.evaluationTypeId}
                          value={String(t.evaluationTypeId)}
                        >
                          {t.evaluationTypeName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              <FieldError errors={[errors.evaluationTypeId]} />
            </Field>

            {evaluationTypeId > 0 ? (
              <Field>
                <FieldLabel>Content Preview</FieldLabel>
                <p className="text-xs text-muted-foreground">
                  A form includes every category and question under its
                  evaluation type. Use the checkboxes to review what will be
                  included — content is managed from Categories and the
                  Question Bank.
                </p>
                <div className="flex max-h-56 flex-col gap-2 overflow-y-auto">
                  {categories.map((cat) => (
                    <CategoryPreviewRow
                      key={cat.catNo}
                      category={cat}
                      checked={!uncheckedCats.has(cat.catNo)}
                      disabled={isPending}
                      onToggle={() =>
                        setUncheckedCats((prev) => {
                          const next = new Set(prev);
                          if (next.has(cat.catNo)) next.delete(cat.catNo);
                          else next.add(cat.catNo);
                          return next;
                        })
                      }
                    />
                  ))}
                </div>
                <p className="text-xs text-muted-foreground">
                  Selected {selectedCount} of {categories.length} categories
                </p>
              </Field>
            ) : null}

            <Field data-invalid={!!errors.gradeBand}>
              <FieldLabel htmlFor="form-grade-band">Grade Band</FieldLabel>
              <Input
                id="form-grade-band"
                placeholder="e.g. Preschool – Grade 3"
                disabled={isPending}
                {...register("gradeBand", {
                  maxLength: { value: 30, message: "Grade band must be at most 30 characters" },
                })}
              />
              <FieldError errors={[errors.gradeBand]} />
            </Field>

            <Field data-invalid={!!errors.targetType}>
              <FieldLabel htmlFor="form-target-type">Target Type</FieldLabel>
              <Controller
                name="targetType"
                control={control}
                rules={{
                  validate: (v) =>
                    TARGET_TYPES.some((t) => t.value === v) ||
                    "Invalid target type",
                }}
                render={({ field }) => (
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                    disabled={isPending}
                  >
                    <SelectTrigger id="form-target-type" className="w-full">
                      <SelectValue placeholder="Select target type" />
                    </SelectTrigger>
                    <SelectContent>
                      {TARGET_TYPES.map((t) => (
                        <SelectItem key={t.value} value={t.value}>
                          {t.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              <FieldError errors={[errors.targetType]} />
            </Field>

            <Field data-invalid={!!errors.programId}>
              <FieldLabel htmlFor="form-program">Program</FieldLabel>
              <Controller
                name="programId"
                control={control}
                rules={{
                  validate: (v) => {
                    const n = Number(v);
                    return (n >= 0 && n <= 3) || "Invalid program";
                  },
                }}
                render={({ field }) => (
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                    disabled={isPending}
                  >
                    <SelectTrigger id="form-program" className="w-full">
                      <SelectValue placeholder="Select program" />
                    </SelectTrigger>
                    <SelectContent>
                      {PROGRAM_OPTIONS.map((o) => (
                        <SelectItem key={o.value} value={String(o.value)}>
                          {o.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              <FieldError errors={[errors.programId]} />
            </Field>

            <Field>
              <label className="flex items-center gap-2.5 text-sm">
                <input
                  type="checkbox"
                  className="size-4 accent-primary"
                  disabled={isPending}
                  {...register("isActive")}
                />
                Active — students can take this form
              </label>
            </Field>
          </FieldGroup>

          {submitError ? (
            <p role="alert" className="mt-4 text-sm text-destructive">
              {submitError}
            </p>
          ) : null}
          <DialogFooter className="mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending
                ? isEdit
                  ? "Saving..."
                  : "Creating..."
                : isEdit
                  ? "Save Changes"
                  : "Create Form"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
