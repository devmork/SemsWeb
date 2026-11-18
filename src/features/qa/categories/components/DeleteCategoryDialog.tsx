import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { Category } from "../types";

interface DeleteCategoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  category?: Category | null;
  onConfirm: (categoryId: number) => void;
  isPending?: boolean;
  error?: string | null;
}

export function DeleteCategoryDialog({
  open,
  onOpenChange,
  category = null,
  onConfirm,
  isPending = false,
  error = null,
}: DeleteCategoryDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Category</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete{" "}
            <span className="font-medium text-foreground">
              {category?.categoryName ?? "this category"}
            </span>
            ? This action can't be undone.
          </DialogDescription>
        </DialogHeader>
        <p className="text-xs text-muted-foreground">
          Categories that still have questions can't be deleted. The server will
          reject the request in that case.
        </p>
        {error ? (
          <p role="alert" className="text-sm text-destructive">
            {error}
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
          <Button
            type="button"
            variant="destructive"
            disabled={isPending || !category}
            onClick={() => category && onConfirm(category.categoryId)}>
            {isPending ? "Deleting..." : "Delete Category"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
