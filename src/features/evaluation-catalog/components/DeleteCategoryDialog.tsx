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
  onConfirm: (id: number) => void;
  isPending?: boolean;
}

export function DeleteCategoryDialog({
  open,
  onOpenChange,
  category = null,
  onConfirm,
  isPending = false,
}: DeleteCategoryDialogProps) {
  const questionCount = category?.questionCount ?? 0;
  const blocked = questionCount > 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Category</DialogTitle>
          {blocked ? (
            <DialogDescription>
              <span className="font-medium text-foreground">
                {category?.name ?? "This category"}
              </span>{" "}
              can't be deleted because it still has {questionCount} assigned
              question{questionCount === 1 ? "" : "s"}. Reassign or remove
              those questions first.
            </DialogDescription>
          ) : (
            <DialogDescription>
              Are you sure you want to delete{" "}
              <span className="font-medium text-foreground">
                {category?.name ?? "this category"}
              </span>
              ? This action can't be undone.
            </DialogDescription>
          )}
        </DialogHeader>
        <DialogFooter className="mt-6">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isPending}
          >
            {blocked ? "Close" : "Cancel"}
          </Button>
          {!blocked ? (
            <Button
              type="button"
              variant="destructive"
              disabled={isPending || !category}
              onClick={() => category && onConfirm(category.id)}
            >
              {isPending ? "Deleting..." : "Delete Category"}
            </Button>
          ) : null}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
