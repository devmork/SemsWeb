import { useMemo } from "react";
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
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useForms } from "@/features/qa/forms";
import type {
  CreateSessionInput,
  Session,
  SessionStatus,
  UpdateSessionInput,
} from "../types";

interface SessionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  session?: Session | null;
  onSubmit: (input: CreateSessionInput | UpdateSessionInput) => void;
  isPending?: boolean;
  submitError?: string | null;
}

interface FormValues {
  formId: string;
  schoolYear: string;
  term: string;
  gradeLevelFrom: string;
  gradeLevelTo: string;
  opensAt: string;
  closesAt: string;
  notes: string;
  status: string;
}

export function SessionDialog({
  open,
  onOpenChange,
  session = null,
  onSubmit,
  isPending = false,
  submitError = null,
}: SessionDialogProps) {
  const isEdit = !!session;

  const { data: forms = [] } = useForms();
  const activeForms = useMemo(
    () => forms.filter((f) => f.isActive === 1),
    [forms],
  );

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      formId: "",
      schoolYear: "",
      term: "1",
      gradeLevelFrom: "",
      gradeLevelTo: "",
      opensAt: "",
      closesAt: "",
      notes: "",
      status: "Draft",
    },
  });

  // Reset form fields whenever the dialog opens (create vs edit).
  if (open && isEdit && session) {
    reset({
      formId: String(session.formId),
      schoolYear: session.schoolYear,
      term: String(session.term),
      gradeLevelFrom:
        session.gradeLevelFrom != null ? String(session.gradeLevelFrom) : "",
      gradeLevelTo:
        session.gradeLevelTo != null ? String(session.gradeLevelTo) : "",
      opensAt: session.opensAtUtc
        ? new Date(session.opensAtUtc).toISOString().slice(0, 16)
        : "",
      closesAt: session.closesAtUtc
        ? new Date(session.closesAtUtc).toISOString().slice(0, 16)
        : "",
      notes: session.notes ?? "",
      status: session.status,
    });
  }

  const parseGrade = (value: string): number | null => {
    const trimmed = value.trim();
    if (trimmed === "") return null;
    const n = Number(trimmed);
    return Number.isFinite(n) ? n : null;
  };

  const onFormSubmit = (values: FormValues) => {
    const gradeLevelFrom = parseGrade(values.gradeLevelFrom);
    const gradeLevelTo = parseGrade(values.gradeLevelTo);

    const input: CreateSessionInput | UpdateSessionInput = isEdit
      ? {
          status: values.status as SessionStatus,
          gradeLevelFrom,
          gradeLevelTo,
          opensAtUtc: values.opensAt || null,
          closesAtUtc: values.closesAt || null,
          notes: values.notes.trim() || undefined,
        }
      : {
          formId: Number(values.formId),
          schoolYear: values.schoolYear.trim(),
          term: Number(values.term),
          gradeLevelFrom,
          gradeLevelTo,
          opensAtUtc: values.opensAt || null,
          closesAtUtc: values.closesAt || null,
          notes: values.notes.trim() || undefined,
        };
    onSubmit(input);
    // Dialog stays open on failure — parent closes it via onOpenChange(false)
    // only in mutation onSuccess. Closing here would lose form data on error.
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit Session" : "Create Session"}</DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Update the session's window, status, and notes."
              : "Bind a form to a school year and term so students can take it."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onFormSubmit)} noValidate>
          <FieldGroup>
            {!isEdit ? (
              <>
                <Field data-invalid={!!errors.formId}>
                  <FieldLabel htmlFor="session-form">Form</FieldLabel>
                  <Controller
                    control={control}
                    name="formId"
                    rules={{ required: "A form is required" }}
                    render={({ field }) => (
                      <Select
                        value={field.value || null}
                        onValueChange={(value) => field.onChange(value ?? "")}
                        disabled={isPending}
                      >
                        <SelectTrigger id="session-form" className="w-full">
                          <SelectValue placeholder="Select an active form">
                            {(value) => {
                              const selected = activeForms.find(
                                (f) => String(f.formId) === String(value),
                              );
                              return selected
                                ? selected.title
                                : "Select an active form";
                            }}
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                          {activeForms.length === 0 ? (
                            <div className="px-2 py-1.5 text-sm text-muted-foreground">
                              No active forms available
                            </div>
                          ) : (
                            activeForms.map((form) => (
                              <SelectItem
                                key={form.formId}
                                value={String(form.formId)}
                              >
                                <span className="flex flex-col">
                                  <span>{form.title}</span>
                                  <span className="text-xs text-muted-foreground">
                                    {form.evaluationTypeName}
                                  </span>
                                </span>
                              </SelectItem>
                            ))
                          )}
                        </SelectContent>
                      </Select>
                    )}
                  />
                  <FieldError errors={[errors.formId]} />
                </Field>
              </>
            ) : (
              <Field>
                <FieldLabel htmlFor="session-form-edit">Form</FieldLabel>
                <Input
                  id="session-form-edit"
                  defaultValue={(session as Session).formTitle}
                  readOnly
                  disabled={isPending}
                />
                <p className="text-xs text-muted-foreground">
                  The form is fixed once a session is created.
                </p>
              </Field>
            )}

            <Field data-invalid={!!errors.schoolYear}>
              <FieldLabel htmlFor="session-school-year">School Year</FieldLabel>
              <Input
                id="session-school-year"
                placeholder="e.g. 2024-2025"
                disabled={isPending}
                {...register("schoolYear", {
                  required: "School year is required",
                  maxLength: {
                    value: 20,
                    message: "School year must be at most 20 characters",
                  },
                })}
              />
              <FieldError errors={[errors.schoolYear]} />
            </Field>

            <Field data-invalid={!!errors.term}>
              <FieldLabel htmlFor="session-term">Term</FieldLabel>
              <Select
                id="session-term"
                disabled={isPending}
                {...register("term", {
                  required: "Term is required",
                })}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select term" />
                </SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 4].map((t) => (
                    <SelectItem key={t} value={String(t)}>
                      Term {t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FieldError errors={[errors.term]} />
            </Field>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field data-invalid={!!errors.gradeLevelFrom}>
                <FieldLabel htmlFor="session-grade-from">
                  Grade level from
                </FieldLabel>
                <Input
                  id="session-grade-from"
                  type="number"
                  min={0}
                  max={12}
                  placeholder="e.g. 4"
                  disabled={isPending}
                  {...register("gradeLevelFrom", {
                    validate: (value) => {
                      if (!value) return true;
                      const n = Number(value);
                      if (!Number.isInteger(n) || n < 0 || n > 12) {
                        return "Grade must be between 0 and 12.";
                      }
                      return true;
                    },
                  })}
                />
                <FieldError errors={[errors.gradeLevelFrom]} />
              </Field>

              <Field data-invalid={!!errors.gradeLevelTo}>
                <FieldLabel htmlFor="session-grade-to">
                  Grade level to
                </FieldLabel>
                <Input
                  id="session-grade-to"
                  type="number"
                  min={0}
                  max={12}
                  placeholder="e.g. 6"
                  disabled={isPending}
                  {...register("gradeLevelTo", {
                    validate: (value) => {
                      if (!value) return true;
                      const n = Number(value);
                      if (!Number.isInteger(n) || n < 0 || n > 12) {
                        return "Grade must be between 0 and 12.";
                      }
                      return true;
                    },
                  })}
                />
                <FieldError errors={[errors.gradeLevelTo]} />
              </Field>
              <p className="text-xs text-muted-foreground sm:col-span-2">
                Optional audience scope (0–12). Leave both blank for all grades.
              </p>
            </div>

            <Field>
              <FieldLabel htmlFor="session-opens-at">Opens At</FieldLabel>
              <Input
                id="session-opens-at"
                type="datetime-local"
                disabled={isPending}
                {...register("opensAt")}
              />
              <p className="text-xs text-muted-foreground">
                When the session becomes available to students. Leave empty to
                open manually.
              </p>
              <FieldError errors={[errors.opensAt]} />
            </Field>

            <Field>
              <FieldLabel htmlFor="session-closes-at">Closes At</FieldLabel>
              <Input
                id="session-closes-at"
                type="datetime-local"
                disabled={isPending}
                {...register("closesAt")}
              />
              <p className="text-xs text-muted-foreground">
                When the session stops accepting submissions. Leave empty to
                close manually.
              </p>
              <FieldError errors={[errors.closesAt]} />
            </Field>

            <Field data-invalid={!!errors.notes}>
              <FieldLabel htmlFor="session-notes">Notes</FieldLabel>
              <textarea
                id="session-notes"
                rows={3}
                className="flex w-full min-w-0 rounded-md border border-input bg-transparent px-2.5 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive md:text-sm dark:bg-input/30"
                placeholder="Optional notes"
                disabled={isPending}
                {...register("notes", {
                  maxLength: {
                    value: 1000,
                    message: "Notes must be at most 1000 characters",
                  },
                })}
              />
              <FieldError errors={[errors.notes]} />
            </Field>

            {isEdit ? (
              <Field data-invalid={!!errors.status}>
                <FieldLabel htmlFor="session-status">Status</FieldLabel>
                <Select
                  id="session-status"
                  disabled={isPending}
                  {...register("status", {
                    required: "Status is required",
                  })}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    {[
                      { value: "Draft", label: "Draft" },
                      { value: "Open", label: "Open" },
                      { value: "Closed", label: "Closed" },
                      { value: "Archived", label: "Archived" },
                    ].map((s) => (
                      <SelectItem key={s.value} value={s.value}>
                        {s.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FieldError errors={[errors.status]} />
              </Field>
            ) : null}
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
                  : "Create Session"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
