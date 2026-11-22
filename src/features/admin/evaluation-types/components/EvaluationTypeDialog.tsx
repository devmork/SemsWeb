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
import type { EvaluationType, CreateEvaluationTypeInput } from "../types";

interface EvaluationTypeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  evaluationType?: EvaluationType | null;
  onSubmit: (input: CreateEvaluationTypeInput) => void;
  isPending?: boolean;
  submitError?: string | null;
}

interface FormValues {
  evaluationTypeName: string;
  isFacility: boolean;
}

export function EvaluationTypeDialog({
  open,
  onOpenChange,
  evaluationType = null,
  onSubmit,
  isPending = false,
  submitError = null,
}: EvaluationTypeDialogProps) {
  const isEdit = !!evaluationType;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: { evaluationTypeName: "", isFacility: false },
  });

  useEffect(() => {
    if (open) {
      reset({
        evaluationTypeName: evaluationType?.evaluationTypeName ?? "",
        isFacility: evaluationType?.isFacility ?? false,
      });
    }
  }, [open, evaluationType, reset]);

  const onFormSubmit = (values: FormValues) => {
    onSubmit({
      evaluationTypeName: values.evaluationTypeName.trim(),
      isFacility: values.isFacility,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isEdit ? "Edit Evaluation Type" : "Add Evaluation Type"}
          </DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Update the name of this evaluation type."
              : "Create a new evaluation type to group categories and questions."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onFormSubmit)} noValidate>
          <FieldGroup>
            <Field data-invalid={!!errors.evaluationTypeName}>
              <FieldLabel htmlFor="evaluation-type-name">Name</FieldLabel>
              <Input
                id="evaluation-type-name"
                placeholder="e.g. Teaching Effectiveness"
                autoFocus
                disabled={isPending}
                {...register("evaluationTypeName", {
                  required: "Name is required",
                  maxLength: {
                    value: 100,
                    message: "Name must be at most 100 characters",
                  },
                  validate: (value) =>
                    value.trim().length > 0 || "Name is required",
                })}
              />
              <FieldError errors={[errors.evaluationTypeName]} />
            </Field>
            <Field>
              <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-border p-3 transition-colors hover:bg-muted/40">
                <input
                  type="checkbox"
                  className="mt-0.5 size-4 accent-primary"
                  disabled={isPending}
                  {...register("isFacility")}
                />
                <span className="flex flex-col gap-0.5">
                  <span className="text-sm font-medium text-foreground">
                    Facility evaluation
                  </span>
                  <span className="text-xs text-muted-foreground">
                    Students evaluate a facility instead of a subject and
                    teacher.
                  </span>
                </span>
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
              disabled={isPending}>
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending
                ? isEdit
                  ? "Saving…"
                  : "Creating…"
                : isEdit
                  ? "Save Changes"
                  : "Create Evaluation Type"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
