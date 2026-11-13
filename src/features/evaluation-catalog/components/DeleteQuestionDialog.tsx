import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { Question } from "../types";

interface DeleteQuestionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  question?: Question | null;
  onConfirm: (qnNo: number) => void;
  isPending?: boolean;
}

export function DeleteQuestionDialog({
  open,
  onOpenChange,
  question = null,
  onConfirm,
  isPending = false,
}: DeleteQuestionDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Question</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete{" "}
            <span className="font-medium text-foreground">
              {question?.text ?? "this question"}
            </span>{" "}
            ? This action can't be undone.
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
            disabled={isPending || !question}
            onClick={() => question && onConfirm(question.id)}
          >
            {isPending ? "Deleting..." : "Delete Question"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
