import { useEffect } from "react";
import { useForm } from "react-hook-form";
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
  name: string;
  weightPercentage: string;
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

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: { name: "", weightPercentage: "" },
  });

  useEffect(() => {
    if (open) {
      reset(
        category
          ? {
              name: category.name,
              weightPercentage: String(category.weightPercentage),
            }
          : { name: "", weightPercentage: "" },
      );
    }
  }, [open, category, reset]);

  const onFormSubmit = (values: FormValues) => {
    onSubmit({
      name: values.name.trim(),
      weightPercentage: Number(values.weightPercentage),
    });
    // Dialog stays open on failure — parent closes it via onOpenChange(false)
    // only in mutation onSuccess. Closing here would lose form data on error.
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isEdit ? "Edit Category" : "Add Category"}
          </DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Update the category name or weight percentage."
              : "Create a new category with its weight percentage. Questions will be assigned to this category."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onFormSubmit)} noValidate>
          <FieldGroup>
            <Field data-invalid={!!errors.name}>
              <FieldLabel htmlFor="category-name">Name</FieldLabel>
              <Input
                id="category-name"
                placeholder="e.g. Teaching Effectiveness"
                autoFocus
                disabled={isPending}
                {...register("name", {
                  required: "Category name is required",
                  minLength: {
                    value: 2,
                    message: "Name must be at least 2 characters",
                  },
                })}
              />
              <FieldError errors={[errors.name]} />
            </Field>
            <Field data-invalid={!!errors.weightPercentage}>
              <FieldLabel htmlFor="category-weight">Weight (%)</FieldLabel>
              <Input
                id="category-weight"
                type="number"
                step="0.1"
                min={1}
                max={100}
                placeholder="e.g. 40"
                disabled={isPending}
                {...register("weightPercentage", {
                  required: "Weight is required",
                  min: { value: 1, message: "Weight must be at least 1%" },
                  max: { value: 100, message: "Weight cannot exceed 100%" },
                })}
              />
              <FieldError errors={[errors.weightPercentage]} />
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
                  : "Create Category"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
