import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
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
import { useEvaluationTypes } from "../hooks/useEvaluationTypes";
import type { Category, CreateCategoryInput } from "../types";

interface CategoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  category?: Category | null;
  onSubmit: (input: CreateCategoryInput) => void;
  isPending?: boolean;
  submitError?: string | null;
}

interface FormValues {
  evaluationTypeId: string;
  categoryName: string;
  categoryRate: string;
}

export function CategoryDialog({
  open,
  onOpenChange,
  category = null,
  onSubmit,
  isPending = false,
  submitError = null,
}: CategoryDialogProps) {
  const isEdit = !!category;
  const { data: evaluationTypes = [] } = useEvaluationTypes();

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      evaluationTypeId: "",
      categoryName: "",
      categoryRate: "",
    },
  });

  useEffect(() => {
    if (open) {
      reset(
        category
          ? {
              evaluationTypeId: String(category.evaluationTypeId),
              categoryName: category.categoryName ?? "",
              categoryRate:
                category.categoryRate == null ? "" : String(category.categoryRate),
            }
          : {
              evaluationTypeId: "",
              categoryName: "",
              categoryRate: "",
            },
      );
    }
  }, [open, category, reset]);

  const onFormSubmit = (values: FormValues) => {
    onSubmit({
      evaluationTypeId: Number(values.evaluationTypeId),
      categoryName: values.categoryName.trim(),
      categoryRate: Number(values.categoryRate),
    });
    // Dialog stays open on failure — parent closes it via onOpenChange(false)
    // only in mutation onSuccess. Closing here would lose form data on error.
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit Category" : "Add Category"}</DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Update the category details. All fields are required."
              : "Create a new category for an evaluation type. Questions will be assigned to this category."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onFormSubmit)} noValidate>
          <FieldGroup>
            <Field data-invalid={!!errors.evaluationTypeId}>
              <FieldLabel htmlFor="category-type">Evaluation Type</FieldLabel>
              <Controller
                name="evaluationTypeId"
                control={control}
                rules={{
                  required: "Evaluation type is required",
                  validate: (v) =>
                    Number(v) > 0 || "Evaluation type is required",
                }}
                render={({ field }) => (
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                    disabled={isPending}>
                    <SelectTrigger id="category-type" className="w-full">
                      <SelectValue placeholder="Select evaluation type" />
                    </SelectTrigger>
                    <SelectContent>
                      {evaluationTypes.map((t) => (
                        <SelectItem
                          key={t.evaluationTypeId}
                          value={String(t.evaluationTypeId)}>
                          {t.evaluationTypeName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              <FieldError errors={[errors.evaluationTypeId]} />
            </Field>
            <Field data-invalid={!!errors.categoryName}>
              <FieldLabel htmlFor="category-name">Name</FieldLabel>
              <Input
                id="category-name"
                placeholder="e.g. Teaching Effectiveness"
                autoFocus
                disabled={isPending}
                {...register("categoryName", {
                  required: "Category name is required",
                  minLength: {
                    value: 2,
                    message: "Name must be at least 2 characters",
                  },
                  maxLength: {
                    value: 150,
                    message: "Name must be at most 150 characters",
                  },
                })}
              />
              <FieldError errors={[errors.categoryName]} />
            </Field>
            <Field data-invalid={!!errors.categoryRate}>
              <FieldLabel htmlFor="category-weight">Weight (%)</FieldLabel>
              <Input
                id="category-weight"
                type="number"
                step="0.1"
                min={0}
                max={100}
                placeholder="e.g. 40"
                disabled={isPending}
                {...register("categoryRate", {
                  required: "Weight is required",
                  min: { value: 0, message: "Weight cannot be negative" },
                  max: { value: 100, message: "Weight cannot exceed 100%" },
                })}
              />
              <FieldError errors={[errors.categoryRate]} />
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
              disabled={isPending}>
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending
                ? isEdit
                  ? "Saving..."
                  : "Creating..."
                : isEdit
                  ? "Save Changes"
                  : "Create Category"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
