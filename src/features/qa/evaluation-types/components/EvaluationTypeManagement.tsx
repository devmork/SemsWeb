import { useState, useEffect, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { ResponsiveTable } from "@/shared/components/ResponsiveTable";
import { IconEdit, IconTrash, IconPlus, IconTags } from "@tabler/icons-react";
import {
  useCreateEvaluationType,
  useDeleteEvaluationType,
  useEvaluationTypes,
  useUpdateEvaluationType,
} from "../hooks/useEvaluationTypes";
import { EvaluationTypeDialog } from "./EvaluationTypeDialog";
import { DeleteEvaluationTypeDialog } from "./DeleteEvaluationTypeDialog";
import type { EvaluationType, CreateEvaluationTypeInput } from "../types";

function mutationErrorMessage(error: unknown): string | null {
  if (!error) return null;
  if (typeof error === "object" && "response" in error) {
    const response = (error as { response?: { data?: { message?: string } } })
      .response;
    if (response?.data?.message) return response.data.message;
  }
  return "Something went wrong. Please try again.";
}

function TableSkeleton() {
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
      <div className="border-b border-border bg-muted/50 px-5 py-3">
        <Skeleton className="h-3 w-24" />
      </div>
      {Array.from({ length: 5 }).map((_, i) => (
        <div
          key={i}
          className="flex items-center gap-4 border-b border-border px-5 py-4 last:border-0">
          <Skeleton className="h-4 flex-1" />
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-9 w-20" />
        </div>
      ))}
    </div>
  );
}

function StateCard({
  icon,
  title,
  description,
  tone = "muted",
}: {
  icon: ReactNode;
  title: string;
  description: string;
  tone?: "muted" | "error";
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-border bg-card px-6 py-16 text-center shadow-sm">
      <div
        className={`flex size-12 items-center justify-center rounded-full ${
          tone === "error"
            ? "bg-destructive/10 text-destructive"
            : "bg-muted text-muted-foreground"
        }`}>
        {icon}
      </div>
      <div className="space-y-1">
        <p className="text-base font-semibold text-foreground">{title}</p>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}

export function EvaluationTypeManagement() {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(query.trim()), 300);
    return () => clearTimeout(timer);
  }, [query]);

  const {
    data: types,
    isPending,
    isError,
    error,
  } = useEvaluationTypes({
    search: debouncedQuery || undefined,
  });
  const {
    mutate: createType,
    isPending: isCreating,
    error: createError,
    reset: resetCreateError,
  } = useCreateEvaluationType();
  const {
    mutate: updateType,
    isPending: isUpdating,
    error: updateError,
    reset: resetUpdateError,
  } = useUpdateEvaluationType();
  const {
    mutate: deleteType,
    isPending: isDeleting,
    error: deleteError,
    reset: resetDeleteError,
  } = useDeleteEvaluationType();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<EvaluationType | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleting, setDeleting] = useState<EvaluationType | null>(null);

  const submitError =
    mutationErrorMessage(createError) ?? mutationErrorMessage(updateError);
  const deleteSubmitError = mutationErrorMessage(deleteError);

  const openCreate = () => {
    setEditing(null);
    resetCreateError();
    resetUpdateError();
    setDialogOpen(true);
  };

  const handleSubmit = (input: CreateEvaluationTypeInput) => {
    const onSuccess = () => {
      setDialogOpen(false);
      setEditing(null);
    };
    if (editing) {
      updateType(
        { evaluationTypeId: editing.evaluationTypeId, ...input },
        { onSuccess },
      );
    } else {
      createType(input, { onSuccess });
    }
  };

  const handleDeleteConfirm = (id: number) => {
    deleteType(id, {
      onSuccess: () => {
        setDeleteDialogOpen(false);
        setDeleting(null);
      },
    });
  };

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            Evaluation Types
          </h1>
          <p className="text-sm text-muted-foreground">
            Create and manage the types used to group evaluation categories and
            questions.
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative w-full sm:w-64">
            <IconTags
              className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground max-[320px]:hidden"
              aria-hidden
            />
            <Input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search types…"
              aria-label="Search evaluation types"
              className="pl-9 max-[320px]:pl-3"
            />
          </div>
          <Button onClick={openCreate}>
            <IconPlus /> Add Type
          </Button>
        </div>
      </header>

      {isPending ? (
        <TableSkeleton />
      ) : isError ? (
        <StateCard
          icon={<IconTags className="size-5" />}
          title="Couldn't load evaluation types"
          description={
            error instanceof Error
              ? error.message
              : "Check your connection and try again."
          }
          tone="error"
        />
      ) : types && types.length > 0 ? (
        <ResponsiveTable
          ariaLabel="Evaluation types"
          minWidth="560px"
          items={types}
          rowKey={(type) => type.evaluationTypeId}
          columns={[
            {
              header: "ID",
              mobileHidden: true,
              className: "text-muted-foreground tabular-nums",
              cell: (type) => type.evaluationTypeId,
            },
            {
              header: "Name",
              primary: true,
              cell: (type) => (
                <span className="font-medium text-foreground">
                  {type.evaluationTypeName}
                </span>
              ),
            },
          ]}
          actions={(type) => (
            <>
              <Button
                variant="ghost"
                size="icon-sm"
                aria-label={`Edit ${type.evaluationTypeName}`}
                onClick={() => {
                  setEditing(type);
                  resetCreateError();
                  resetUpdateError();
                  setDialogOpen(true);
                }}>
                <IconEdit />
              </Button>
              <Button
                variant="ghost"
                size="icon-sm"
                aria-label={`Delete ${type.evaluationTypeName}`}
                className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                onClick={() => {
                  resetDeleteError();
                  setDeleting(type);
                  setDeleteDialogOpen(true);
                }}>
                <IconTrash />
              </Button>
            </>
          )}
        />
      ) : (
        <StateCard
          icon={<IconTags className="size-5" />}
          title={debouncedQuery ? "No types found" : "No evaluation types yet"}
          description={
            debouncedQuery
              ? "Try a different name."
              : "Add an evaluation type to start organizing categories and questions."
          }
        />
      )}

      <EvaluationTypeDialog
        open={dialogOpen}
        onOpenChange={(open) => {
          setDialogOpen(open);
          if (!open) setEditing(null);
        }}
        evaluationType={editing}
        onSubmit={handleSubmit}
        isPending={isCreating || isUpdating}
        submitError={submitError}
      />
      <DeleteEvaluationTypeDialog
        open={deleteDialogOpen}
        onOpenChange={(open) => {
          setDeleteDialogOpen(open);
          if (!open) setDeleting(null);
        }}
        evaluationType={deleting}
        onConfirm={handleDeleteConfirm}
        isPending={isDeleting}
        error={deleteSubmitError}
      />
    </div>
  );
}
