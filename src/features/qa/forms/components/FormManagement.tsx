import { useMemo, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForms, useDeleteForm } from "../hooks/useForms";
import type { Form } from "../types";
import { FormTable } from "./FormTable";
import { DeleteFormDialog } from "./DeleteFormDialog";

export function FormManagement() {
  const navigate = useNavigate();
  const { data: forms = [], isLoading, error } = useForms();
  const { mutate: deleteForm, isPending: isDeleting } = useDeleteForm();

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingForm, setDeletingForm] = useState<Form | null>(null);
  const [query, setQuery] = useState("");

  const trimmedQuery = query.trim().toLowerCase();
  const filteredForms = useMemo(
    () =>
      trimmedQuery
        ? forms.filter((f) => f.title.toLowerCase().includes(trimmedQuery))
        : forms,
    [forms, trimmedQuery],
  );

  const handleDeleteConfirm = (id: number) => {
    deleteForm(id, {
      onSuccess: () => {
        setDeleteDialogOpen(false);
        setDeletingForm(null);
      },
    });
  };

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            Forms
          </h1>
          <p className="text-sm text-muted-foreground">
            Build evaluation forms: pick an evaluation type, link categories, and
            author questions per category.
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative w-full sm:w-64">
            <Input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search forms…"
              aria-label="Search forms"
              className="pl-3"
            />
          </div>
          <Button onClick={() => navigate({ to: "/qa/forms/create" })}>
            Add Form
          </Button>
        </div>
      </header>

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-16 animate-pulse rounded-xl border border-border bg-muted" />
          ))}
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-border bg-card py-16 text-center shadow-sm">
          <p className="text-sm font-medium">Couldn't load forms</p>
          <p className="text-sm text-muted-foreground">
            Check your connection and try again.
          </p>
          <Button variant="outline" size="sm" onClick={() => window.location.reload()}>
            Retry
          </Button>
        </div>
      ) : filteredForms.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-border bg-card py-16 text-center shadow-sm">
          <p className="text-sm font-medium">No form templates yet</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Create one to pick an evaluation type, the categories it covers,
            and the questions under each.
          </p>
        </div>
      ) : (
        <FormTable
          forms={filteredForms}
          onManageContent={(form) =>
            navigate({
              to: "/qa/forms/$formId",
              params: { formId: String(form.formId) },
            })
          }
          onEdit={(form) =>
            navigate({
              to: "/qa/forms/$formId",
              params: { formId: String(form.formId) },
            })
          }
          onDelete={(form) => {
            setDeletingForm(form);
            setDeleteDialogOpen(true);
          }}
        />
      )}

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
