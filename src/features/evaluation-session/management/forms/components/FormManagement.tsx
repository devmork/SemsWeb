import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useForms,
  useCreateForm,
  useDeleteForm,
  useUpdateForm,
} from "../hooks/useForms";
import type { CreateFormInput, Form } from "../types";
import { FormTable } from "./FormTable";
import { FormDialog } from "./FormDialog";
import { DeleteFormDialog } from "./DeleteFormDialog";

function mutationErrorMessage(error: unknown): string | null {
  if (!error) return null;
  if (typeof error === "object" && "response" in error) {
    const response = (
      error as { response?: { data?: { message?: string } } }
    ).response;
    if (response?.data?.message) return response.data.message;
  }
  return "Something went wrong. Please try again.";
}

function FormCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-xl border border-hairline">
      <div className="space-y-3 p-4">
        <Skeleton className="h-5 w-full" />
        <Skeleton className="h-5 w-full" />
        <Skeleton className="h-5 w-3/4" />
      </div>
    </div>
  );
}

export function FormManagement() {
  const { data: forms = [], isLoading, error } = useForms();
  const {
    mutate: createForm,
    isPending: isCreating,
    error: createError,
    reset: resetCreateError,
  } = useCreateForm();
  const {
    mutate: updateForm,
    isPending: isUpdating,
    error: updateError,
    reset: resetUpdateError,
  } = useUpdateForm();
  const { mutate: deleteForm, isPending: isDeleting } = useDeleteForm();

  const [formDialogOpen, setFormDialogOpen] = useState(false);
  const [editingForm, setEditingForm] = useState<Form | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingForm, setDeletingForm] = useState<Form | null>(null);
  const [query, setQuery] = useState("");

  const trimmedQuery = query.trim().toLowerCase();
  const filteredForms = useMemo(
    () =>
      trimmedQuery
        ? forms.filter(
            (f) =>
              f.title.toLowerCase().includes(trimmedQuery) ||
              f.code.toLowerCase().includes(trimmedQuery),
          )
        : forms,
    [forms, trimmedQuery],
  );

  const submitError =
    mutationErrorMessage(createError) ?? mutationErrorMessage(updateError);

  const handleFormSubmit = (input: CreateFormInput) => {
    const onSuccess = () => {
      setFormDialogOpen(false);
      setEditingForm(null);
    };
    if (editingForm) {
      updateForm({ id: editingForm.formId, input }, { onSuccess });
    } else {
      createForm(input, { onSuccess });
    }
  };

  const handleDeleteConfirm = (id: number) => {
    deleteForm(id, {
      onSuccess: () => {
        setDeleteDialogOpen(false);
        setDeletingForm(null);
      },
    });
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-lg font-semibold">Form Templates</h1>
        <Button
          onClick={() => {
            setEditingForm(null);
            resetCreateError();
            resetUpdateError();
            setFormDialogOpen(true);
          }}
        >
          Add Form
        </Button>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search forms..."
          aria-label="Search forms"
          className="max-w-xs"
        />
      </div>

      {isLoading ? (
        <FormCardSkeleton />
      ) : error ? (
        <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-hairline py-16 text-center">
          <p className="text-sm font-medium">Couldn't load forms</p>
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
      ) : filteredForms.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <p className="text-sm font-medium">No form templates yet</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Create one to pair an evaluation type with a title and code.
          </p>
        </div>
      ) : (
        <FormTable
          forms={filteredForms}
          onEdit={(form) => {
            setEditingForm(form);
            resetCreateError();
            resetUpdateError();
            setFormDialogOpen(true);
          }}
          onDelete={(form) => {
            setDeletingForm(form);
            setDeleteDialogOpen(true);
          }}
        />
      )}

      <FormDialog
        open={formDialogOpen}
        onOpenChange={(open) => {
          setFormDialogOpen(open);
          if (!open) setEditingForm(null);
        }}
        form={editingForm}
        onSubmit={handleFormSubmit}
        isPending={isCreating || isUpdating}
        submitError={submitError}
      />
      <DeleteFormDialog
        open={deleteDialogOpen}
        onOpenChange={(open) => {
          setDeleteDialogOpen(open);
          if (!open) setDeletingForm(null);
        }}
        form={deletingForm}
        onConfirm={handleDeleteConfirm}
        isPending={isDeleting}
      />
    </div>
  );
}
