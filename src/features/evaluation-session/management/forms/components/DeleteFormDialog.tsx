import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { Form } from "../types";

interface DeleteFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  form?: Form | null;
  onConfirm: (id: number) => void;
  isPending?: boolean;
}

export function DeleteFormDialog({
  open,
  onOpenChange,
  form = null,
  onConfirm,
  isPending = false,
}: DeleteFormDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Form</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete{" "}
            <span className="font-medium text-foreground">
              {form?.code ?? "this form"}
              {form?.title ? ` — ${form.title}` : ""}
            </span>
            ? Forms used by evaluation sessions may break. This action can't be
            undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="mt-6">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isPending}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="destructive"
            disabled={isPending || !form}
            onClick={() => form && onConfirm(form.formId)}
          >
            {isPending ? "Deleting..." : "Delete Form"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
