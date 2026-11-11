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
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      formId: "",
      schoolYear: "",
      term: "1",
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

  const onFormSubmit = (values: FormValues) => {
    const input: CreateSessionInput | UpdateSessionInput = isEdit
      ? {
          status: values.status as SessionStatus,
          opensAtUtc: values.opensAt || null,
          closesAtUtc: values.closesAt || null,
          notes: values.notes.trim() || undefined,
        }
      : {
          formId: Number(values.formId),
          schoolYear: values.schoolYear.trim(),
          term: Number(values.term),
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
      <DialogContent className="sm:max-w-lg">
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
                  <Select
                    id="session-form"
                    disabled={isPending}
                    {...register("formId", {
                      required: "A form is required",
                    })}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select a form" />
                    </SelectTrigger>
                    <SelectContent />
                  </Select>
                  <FieldError errors={[errors.formId]} />
                </Field>
              </>
            ) : (
              <Field>
                <FieldLabel htmlFor="session-form-edit">Form</FieldLabel>
                <Input
                  id="session-form-edit"
                  defaultValue={
                    (session as Session).formTitle +
                    " (" +
                    (session as Session).formCode +
                    ")"
                  }
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
