import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useCategories,
  useCreateCategory,
  useDeleteCategory,
  useUpdateCategory,
} from "../hooks/useCategories";
import type { Category, CreateCategoryInput } from "../types";
import { CategoryDialog } from "./CategoryDialog";
import { CategoryTable } from "./CategoryTable";
import { DeleteCategoryDialog } from "./DeleteCategoryDialog";

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

function CategoryTableSkeleton() {
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

export function CategoryManagement() {
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
  const { mutate: deleteCategory, isPending: isDeleting } =
    useDeleteCategory();

  const [categoryDialogOpen, setCategoryDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingCategory, setDeletingCategory] = useState<Category | null>(
    null,
  );
  const [query, setQuery] = useState("");

  const trimmedQuery = query.trim().toLowerCase();
  const filteredCategories = useMemo(
    () =>
      trimmedQuery
        ? categories.filter((c) => c.name.toLowerCase().includes(trimmedQuery))
        : categories,
    [categories, trimmedQuery],
  );

  const totalWeight = useMemo(
    () => categories.reduce((sum, c) => sum + c.weightPercentage, 0),
    [categories],
  );
  const weightBalanced = Math.abs(totalWeight - 100) < 0.05;

  const submitError =
    mutationErrorMessage(createError) ?? mutationErrorMessage(updateError);

  const handleCategorySubmit = (input: CreateCategoryInput) => {
    const onSuccess = () => {
      setCategoryDialogOpen(false);
      setEditingCategory(null);
    };
    if (editingCategory) {
      updateCategory({ id: editingCategory.id, input }, { onSuccess });
    } else {
      createCategory(input, { onSuccess });
    }
  };

  const handleDeleteConfirm = (id: number) => {
    deleteCategory(id, {
      onSuccess: () => {
        setDeleteDialogOpen(false);
        setDeletingCategory(null);
      },
    });
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-lg font-semibold">Categories</h1>
          <p className="text-sm text-muted-foreground">
            Manage evaluation categories and their weight percentages.
          </p>
        </div>
        <Button
          onClick={() => {
            setEditingCategory(null);
            resetCreateError();
            resetUpdateError();
            setCategoryDialogOpen(true);
          }}
        >
          Add Category
        </Button>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search categories..."
          aria-label="Search categories"
          className="max-w-xs"
        />
        {!isLoading && !error && categories.length > 0 ? (
          <div className="flex items-center gap-2">
            <Progress value={Math.min(100, totalWeight)} className="w-24" />
            <span
              className={
                weightBalanced
                  ? "text-sm text-muted-foreground tabular-nums"
                  : "text-sm font-medium text-amber-600 tabular-nums"
              }
            >
              Total {totalWeight}%
              {weightBalanced ? "" : " — should total 100%"}
            </span>
          </div>
        ) : null}
      </div>

      {isLoading ? (
        <CategoryTableSkeleton />
      ) : error ? (
        <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-hairline py-16 text-center">
          <p className="text-sm font-medium">Couldn't load categories</p>
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
      ) : (
        <CategoryTable
          categories={filteredCategories}
          onEdit={(category) => {
            setEditingCategory(category);
            resetCreateError();
            resetUpdateError();
            setCategoryDialogOpen(true);
          }}
          onDelete={(category) => {
            setDeletingCategory(category);
            setDeleteDialogOpen(true);
          }}
        />
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
      />
    </div>
  );
}
