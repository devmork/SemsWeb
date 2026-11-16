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
import type { Question, CreateQuestionInput } from "../types";

interface QuestionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  question?: Question | null;
  onSubmit: (input: CreateQuestionInput) => void;
  isPending?: boolean;
  submitError?: string | null;
}

export function QuestionDialog({
  open,
  onOpenChange,
  question = null,
  onSubmit,
  isPending = false,
  submitError = null,
}: QuestionDialogProps) {
  const isEdit = !!question;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<{ text: string }>({ defaultValues: { text: "" } });

  useEffect(() => {
    if (open) {
      reset({ text: question?.text ?? "" });
    }
  }, [open, question, reset]);

  const onFormSubmit = (values: { text: string }) => {
    onSubmit({ text: values.text.trim() });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit Question" : "Add Question"}</DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Update the question text."
              : "Create a new question for this category."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onFormSubmit)} noValidate>
          <FieldGroup>
            <Field data-invalid={!!errors.text}>
              <FieldLabel htmlFor="question-text">Question</FieldLabel>
              <Input
                id="question-text"
                placeholder="e.g. How clear are the instructor's explanations?"
                autoFocus
                disabled={isPending}
                {...register("text", {
                  required: "Question text is required",
                  minLength: {
                    value: 5,
                    message: "Question must be at least 5 characters",
                  },
                })}
              />
              <FieldError errors={[errors.text]} />
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
              {isPending ? (isEdit ? "Saving..." : "Creating...") : isEdit ? "Save Changes" : "Create Question"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
