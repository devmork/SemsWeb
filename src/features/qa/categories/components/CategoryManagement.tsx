import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { IconEdit, IconTrash, IconPlus, IconFolderOpen } from "@tabler/icons-react";
import {
  useCreateCategory,
  useDeleteCategory,
  useCategories,
  useUpdateCategory,
} from "../hooks/useCategories";
import type { Category, CreateCategoryInput } from "../types";
import { CategoryDialog } from "./CategoryDialog";
import { DeleteCategoryDialog } from "./DeleteCategoryDialog";

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
  icon: React.ReactNode;
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

export function CategoryManagement() {
  const [query, setQuery] = useState("");

  const { data: categories = [], isLoading, error } = useCategories();
  const {
    mutate: createCategory,
    isPending: isCreating,
    error: createError,
    reset: resetCreateError,
  } = useCreateCategory();
  const {
    mutate: updateCategory,
    isPending: isUpdating,
    error: updateError,
    reset: resetUpdateError,
  } = useUpdateCategory();
  const {
    mutate: deleteCategory,
    isPending: isDeleting,
    error: deleteError,
    reset: resetDeleteError,
  } = useDeleteCategory();

  const [categoryDialogOpen, setCategoryDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingCategory, setDeletingCategory] = useState<Category | null>(
    null,
  );

const trimmedQuery = query.trim().toLowerCase();

const filteredCategories = useMemo(
    () =>
      trimmedQuery
        ? categories.filter((c) =>
            (c.categoryName ?? "").toLowerCase().includes(trimmedQuery),
          )
        : categories,
    [categories, trimmedQuery],
  );

  const submitError =
    mutationErrorMessage(createError) ?? mutationErrorMessage(updateError);
  const deleteSubmitError = mutationErrorMessage(deleteError);

  const openCreate = () => {
    setEditingCategory(null);
    resetCreateError();
    resetUpdateError();
    setCategoryDialogOpen(true);
  };

  const handleCategorySubmit = (input: CreateCategoryInput) => {
    const onSuccess = () => {
      setCategoryDialogOpen(false);
      setEditingCategory(null);
    };
    if (editingCategory) {
      updateCategory(
        { categoryId: editingCategory.categoryId, input },
        { onSuccess },
      );
    } else {
      createCategory(input, { onSuccess });
    }
  };

  const handleDeleteConfirm = (categoryId: number) => {
    deleteCategory(categoryId, {
      onSuccess: () => {
        setDeleteDialogOpen(false);
        setDeletingCategory(null);
      },
    });
  };

  // client-side search only

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            Categories
          </h1>
          <p className="text-sm text-muted-foreground">
            Shared evaluation categories. Questions are now managed per form.
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative w-full sm:w-64">
            <IconFolderOpen
              className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden
            />
            <Input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search categories…"
              aria-label="Search categories"
              className="pl-9"
            />
          </div>
          <Button onClick={openCreate}>
            <IconPlus /> Add Category
          </Button>
        </div>
      </header>

      {isLoading ? (
        <TableSkeleton />
      ) : error ? (
        <StateCard
          icon={<IconFolderOpen className="size-5" />}
          title="Couldn't load categories"
          description={
            error instanceof Error
              ? error.message
              : "Check your connection and try again."
          }
          tone="error"
        />
      ) : filteredCategories.length === 0 ? (
        <StateCard
          icon={<IconFolderOpen className="size-5" />}
          title={trimmedQuery ? "No categories found" : "No categories yet"}
          description={
            trimmedQuery
              ? "Try a different name."
              : "Create a category to start organizing questions."
          }
        />
      ) : (
        <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
          <table className="w-full min-w-[560px] text-left">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Name
                </th>
                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Weight
                </th>
                <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredCategories.map((category) => (
                <tr
                  key={category.categoryId}
                  className="border-b border-border last:border-0 transition-colors hover:bg-muted/40">
                  <td className="px-5 py-3 text-sm font-medium text-foreground">
                    {category.categoryName}
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex min-w-32 items-center gap-2">
                      <span className="text-sm tabular-nums text-muted-foreground">
                        {category.categoryRate ?? "—"}%
                      </span>
                    </div>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        aria-label={`Edit ${category.categoryName}`}
                        onClick={() => {
                          setEditingCategory(category);
                          resetCreateError();
                          resetUpdateError();
                          setCategoryDialogOpen(true);
                        }}>
                        <IconEdit />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        aria-label={`Delete ${category.categoryName}`}
                        className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                        onClick={() => {
                          resetDeleteError();
                          setDeletingCategory(category);
                          setDeleteDialogOpen(true);
                        }}>
                        <IconTrash />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <CategoryDialog
        open={categoryDialogOpen}
        onOpenChange={(open) => {
          setCategoryDialogOpen(open);
          if (!open) setEditingCategory(null);
        }}
        category={editingCategory}
        onSubmit={handleCategorySubmit}
        isPending={isCreating || isUpdating}
        submitError={submitError}
      />
      <DeleteCategoryDialog
        open={deleteDialogOpen}
        onOpenChange={(open) => {
          setDeleteDialogOpen(open);
          if (!open) setDeletingCategory(null);
        }}
        category={deletingCategory}
        onConfirm={handleDeleteConfirm}
        isPending={isDeleting}
        error={deleteSubmitError}
      />
    </div>
  );
}
