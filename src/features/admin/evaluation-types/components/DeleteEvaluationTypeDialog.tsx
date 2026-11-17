import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { EvaluationType } from "../types";

interface DeleteEvaluationTypeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  evaluationType?: EvaluationType | null;
  onConfirm: (id: number) => void;
  isPending?: boolean;
  error?: string | null;
}

export function DeleteEvaluationTypeDialog({
  open,
  onOpenChange,
  evaluationType = null,
  onConfirm,
  isPending = false,
  error = null,
}: DeleteEvaluationTypeDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Evaluation Type</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete{" "}
            <span className="font-medium text-foreground">
              {evaluationType?.evaluationTypeName ?? "this evaluation type"}
            </span>
            ? This action can't be undone.
          </DialogDescription>
        </DialogHeader>
        <p className="text-xs text-muted-foreground">
          Evaluation types used by categories, forms, or comments can't be
          deleted — the server will reject the request in that case.
        </p>
        {error ? (
          <p role="alert" className="text-sm text-destructive">{error}</p>
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
            disabled={isPending || !evaluationType}
            onClick={() =>
              evaluationType && onConfirm(evaluationType.evaluationTypeId)
            }>
            {isPending ? "Deleting…" : "Delete Evaluation Type"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
