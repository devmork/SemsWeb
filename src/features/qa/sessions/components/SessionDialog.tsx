import { useEffect, useMemo } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
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
import { SEMESTERS } from "@/shared/lib/semester";
import { useEvaluationTypes } from "@/features/qa/forms";
import { useForms } from "@/features/qa/forms";
import { useSessionFacilities } from "../hooks/useSessions";
import {
  GRADE_LEVEL_OPTIONS,
  MAX_GRADE_LEVEL,
  MIN_GRADE_LEVEL,
} from "../types";
import { localInputToUtcIso, utcIsoToLocalInput } from "../utils/datetime";
import type {
  CreateSessionInput,
  Session,
  SessionStatus,
  UpdateSessionInput,
} from "../types";

const FACILITY_REQUIRED_MESSAGE =
  "A facility is required for a facility evaluation";

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
  facilityId: string;
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
  const { data: evaluationTypes = [] } = useEvaluationTypes();
  const { data: facilities = [] } = useSessionFacilities();
  const activeForms = useMemo(
    () => forms.filter((f) => f.isActive === 1),
    [forms],
  );

  const {
    register,
    control,
    handleSubmit,
    reset,
    setError,
    clearErrors,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      formId: "",
      facilityId: "",
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

  const selectedFormId = useWatch({ control, name: "formId" });
  const selectedFacilityId = useWatch({ control, name: "facilityId" });
  const selectedForm = useMemo(
    () => activeForms.find((f) => String(f.formId) === String(selectedFormId)),
    [activeForms, selectedFormId],
  );
  const isFacilityForm = useMemo(() => {
    if (session) {
      if (session.facilityId != null) return true;
      if (session.evaluationTypeName?.toLowerCase() === "facility") return true;
    }
    return (
      evaluationTypes.find(
        (type) => type.evaluationTypeId === selectedForm?.evaluationTypeId,
      )?.evaluationTypeName?.toLowerCase() === "facility"
    );
  }, [evaluationTypes, selectedForm, session]);

  // A facility must be chosen only for facility forms. Clear any stale choice
  // when the QA user switches to a teacher/subject form.
  useEffect(() => {
    if (!isFacilityForm && selectedFacilityId) {
      setValue("facilityId", "");
    }
  }, [isFacilityForm, selectedFacilityId, setValue]);

  // Reset form fields whenever the dialog opens (create vs edit). This must run
  // in an effect: calling reset() during render updates form state on every
  // render and React aborts with "Too many re-renders" (#301).
  useEffect(() => {
    if (!open) return;
    reset(
      session
        ? {
            formId: String(session.formId),
            facilityId:
              session.facilityId != null ? String(session.facilityId) : "",
            schoolYear: session.schoolYear,
            term: String(session.term),
            gradeLevelFrom:
              session.gradeLevelFrom != null ? String(session.gradeLevelFrom) : "",
            gradeLevelTo:
              session.gradeLevelTo != null ? String(session.gradeLevelTo) : "",
            opensAt: utcIsoToLocalInput(session.opensAtUtc),
            closesAt: utcIsoToLocalInput(session.closesAtUtc),
            notes: session.notes ?? "",
            status: session.status,
          }
        : {
            formId: "",
            facilityId: "",
            schoolYear: "",
            term: "1",
            gradeLevelFrom: "",
            gradeLevelTo: "",
            opensAt: "",
            closesAt: "",
            notes: "",
            status: "Draft",
          },
    );
  }, [open, session, reset]);

  const onFormSubmit = (values: FormValues) => {
    const toGradeLevel = (value: string): number | null => {
      const trimmed = value.trim();
      if (trimmed === "") return null;
      const n = Number(trimmed);
      return Number.isInteger(n) &&
        n >= MIN_GRADE_LEVEL &&
        n <= MAX_GRADE_LEVEL
        ? n
        : null;
    };

    const gradeLevelFrom = toGradeLevel(values.gradeLevelFrom);
    const gradeLevelTo = toGradeLevel(values.gradeLevelTo);

    if (
      gradeLevelFrom != null &&
      gradeLevelTo != null &&
      gradeLevelFrom > gradeLevelTo
    ) {
      // Mirror EvaluationSessionHelper.ValidateGradeRange.
      setError("gradeLevelFrom", {
        type: "range",
        message: "Must not be greater than the upper bound.",
      });
      return;
    }
    clearErrors("gradeLevelFrom");

    if (isFacilityForm && !values.facilityId) {
      setError("facilityId", {
        type: "required",
        message: FACILITY_REQUIRED_MESSAGE,
      });
      return;
    }
    clearErrors("facilityId");

    const input: CreateSessionInput | UpdateSessionInput = isEdit
      ? {
          status: values.status as SessionStatus,
          gradeLevelFrom,
          gradeLevelTo,
          opensAtUtc: localInputToUtcIso(values.opensAt),
          closesAtUtc: localInputToUtcIso(values.closesAt),
          notes: values.notes.trim() || undefined,
        }
      : {
          formId: Number(values.formId),
          facilityId: isFacilityForm ? Number(values.facilityId) : null,
          schoolYear: values.schoolYear.trim(),
          term: Number(values.term),
          gradeLevelFrom,
          gradeLevelTo,
          opensAtUtc: localInputToUtcIso(values.opensAt),
          closesAtUtc: localInputToUtcIso(values.closesAt),
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
              : "Bind a form to a school year and semester so students can take it."}
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

            {isFacilityForm && !isEdit ? (
              <Field data-invalid={!!errors.facilityId}>
                <FieldLabel htmlFor="session-facility">Facility</FieldLabel>
                <Controller
                  control={control}
                  name="facilityId"
                  rules={{
                    required: isFacilityForm ? FACILITY_REQUIRED_MESSAGE : false,
                  }}
                  render={({ field }) => (
                    <Select
                      value={field.value || null}
                      onValueChange={(value) => field.onChange(value ?? "")}
                      disabled={isPending}
                    >
                      <SelectTrigger id="session-facility" className="w-full">
                        <SelectValue placeholder="Select a facility">
                          {(value) => {
                            const selected = facilities.find(
                              (f) => String(f.facilityId) === String(value),
                            );
                            return selected
                              ? selected.facilityName
                              : "Select a facility";
                          }}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        {facilities.length === 0 ? (
                          <div className="px-2 py-1.5 text-sm text-muted-foreground">
                            No active facilities available
                          </div>
                        ) : (
                          facilities.map((facility) => (
                            <SelectItem
                              key={facility.facilityId}
                              value={String(facility.facilityId)}
                            >
                              {facility.facilityName}
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                  )}
                />
                <p className="text-xs text-muted-foreground">
                  This facility evaluation is shown only to students evaluating
                  the selected facility.
                </p>
                <FieldError errors={[errors.facilityId]} />
              </Field>
            ) : null}

            {isEdit && session?.facilityName ? (
              <Field>
                <FieldLabel htmlFor="session-facility-edit">Facility</FieldLabel>
                <Input
                  id="session-facility-edit"
                  defaultValue={session.facilityName}
                  readOnly
                  disabled={isPending}
                />
                <p className="text-xs text-muted-foreground">
                  The facility is fixed once a facility session is created.
                </p>
              </Field>
            ) : null}

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
              <FieldLabel htmlFor="session-term">Semester</FieldLabel>
              <Select
                id="session-term"
                disabled={isPending}
                {...register("term", {
                  required: "Semester is required",
                })}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select semester" />
                </SelectTrigger>
                <SelectContent>
                  {SEMESTERS.map((semester) => (
                    <SelectItem
                      key={semester.value}
                      value={String(semester.value)}
                    >
                      {semester.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FieldError errors={[errors.term]} />
            </Field>

            {!isFacilityForm && (
              <div className="grid gap-4 sm:grid-cols-2">
              <Field data-invalid={!!errors.gradeLevelFrom}>
                <FieldLabel htmlFor="session-grade-from">
                  Grade level from
                </FieldLabel>
                <Controller
                  control={control}
                  name="gradeLevelFrom"
                  render={({ field }) => (
                    <Select
                      value={field.value || null}
                      onValueChange={(value) => field.onChange(value ?? "")}
                      disabled={isPending}
                    >
                      <SelectTrigger id="session-grade-from" className="w-full">
                        <SelectValue placeholder="No lower bound" />
                      </SelectTrigger>
                      <SelectContent>
                        {GRADE_LEVEL_OPTIONS.map((grade) => (
                          <SelectItem
                            key={grade.value}
                            value={String(grade.value)}
                          >
                            {grade.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                <FieldError errors={[errors.gradeLevelFrom]} />
              </Field>

              <Field data-invalid={!!errors.gradeLevelTo}>
                <FieldLabel htmlFor="session-grade-to">Grade level to</FieldLabel>
                <Controller
                  control={control}
                  name="gradeLevelTo"
                  render={({ field }) => (
                    <Select
                      value={field.value || null}
                      onValueChange={(value) => field.onChange(value ?? "")}
                      disabled={isPending}
                    >
                      <SelectTrigger id="session-grade-to" className="w-full">
                        <SelectValue placeholder="No upper bound" />
                      </SelectTrigger>
                      <SelectContent>
                        {GRADE_LEVEL_OPTIONS.map((grade) => (
                          <SelectItem
                            key={grade.value}
                            value={String(grade.value)}
                          >
                            {grade.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                <FieldError errors={[errors.gradeLevelTo]} />
              </Field>
              <p className="text-xs text-muted-foreground sm:col-span-2">
                Optional audience scope ({MIN_GRADE_LEVEL}–{MAX_GRADE_LEVEL},
                where {MIN_GRADE_LEVEL} = Nursery and {MAX_GRADE_LEVEL} = Grade
                12). Leave both blank for all grades.
              </p>
            </div>
            )}

            <Field>
              <FieldLabel htmlFor="session-opens-at">Opens At</FieldLabel>
              <Input
                id="session-opens-at"
                type="datetime-local"
                disabled={isPending}
                {...register("opensAt")}
              />
              <p className="text-xs text-muted-foreground">
                Local date and time — stored as UTC. Leave empty to open
                manually.
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
                Local date and time — stored as UTC. Leave empty to keep the
                session open.
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
