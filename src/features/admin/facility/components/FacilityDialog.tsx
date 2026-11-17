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
import type {
  Facility,
  CreateFacilityInput,
} from "../types";

type FacilityFormInput = CreateFacilityInput & { isActive?: boolean | undefined };

interface FacilityDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  facility?: Facility | null;
  onSubmit: (input: FacilityFormInput) => void;
  isPending?: boolean;
  submitError?: string | null;
}

interface FormValues {
  facilityName: string;
  location: string;
  description: string;
  isActive: boolean;
}

export function FacilityDialog({
  open,
  onOpenChange,
  facility = null,
  onSubmit,
  isPending = false,
  submitError = null,
}: FacilityDialogProps) {
  const isEdit = !!facility;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      facilityName: "",
      location: "",
      description: "",
      isActive: true,
    },
  });

  useEffect(() => {
    if (open) {
      reset(
        facility
          ? {
              facilityName: facility.facilityName,
              location: facility.location ?? "",
              description: facility.description ?? "",
              isActive: facility.isActive,
            }
          : {
              facilityName: "",
              location: "",
              description: "",
              isActive: true,
            },
      );
    }
  }, [open, facility, reset]);

  const onFormSubmit = (values: FormValues) => {
    onSubmit({
      facilityName: values.facilityName.trim(),
      location: values.location.trim() || undefined,
      description: values.description.trim() || undefined,
      isActive: values.isActive,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit Facility" : "Add Facility"}</DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Update the facility details, including whether it is active."
              : "Register a new campus facility that students can evaluate."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onFormSubmit)} noValidate>
          <FieldGroup>
            <Field data-invalid={!!errors.facilityName}>
              <FieldLabel htmlFor="facility-name">Name</FieldLabel>
              <Input
                id="facility-name"
                placeholder="e.g. Science Laboratory"
                autoFocus
                disabled={isPending}
                {...register("facilityName", {
                  required: "Facility name is required",
                  minLength: { value: 2, message: "Name is too short" },
                  maxLength: { value: 100, message: "Name is too long" },
                })}
              />
              <FieldError errors={[errors.facilityName]} />
            </Field>
            <Field data-invalid={!!errors.location}>
              <FieldLabel htmlFor="facility-location">Location</FieldLabel>
              <Input
                id="facility-location"
                placeholder="e.g. Building A, Room 301"
                disabled={isPending}
                {...register("location", {
                  maxLength: { value: 150, message: "Location is too long" },
                })}
              />
              <FieldError errors={[errors.location]} />
            </Field>
            <Field data-invalid={!!errors.description}>
              <FieldLabel htmlFor="facility-description">Description</FieldLabel>
              <Input
                id="facility-description"
                placeholder="Brief description of the facility"
                disabled={isPending}
                {...register("description", {
                  maxLength: { value: 500, message: "Description is too long" },
                })}
              />
              <FieldError errors={[errors.description]} />
            </Field>
            {isEdit && (
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  {...register("isActive")}
                  className="size-4 accent-primary"
                />
                Active (available for evaluation)
              </label>
            )}
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
                  : "Create Facility"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
