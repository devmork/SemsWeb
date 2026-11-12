import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { Session } from "../types";

interface DeleteSessionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  session?: Session | null;
  onConfirm: (id: number) => void;
  isPending?: boolean;
}

export function DeleteSessionDialog({
  open,
  onOpenChange,
  session = null,
  onConfirm,
  isPending = false,
}: DeleteSessionDialogProps) {
  const submissionCount = session?.submissionCount ?? 0;
  const blocked =
    submissionCount > 0 || session?.status === "Open";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Session</DialogTitle>
          {blocked ? (
            <DialogDescription>
              <span className="font-medium text-foreground">
                {session?.formTitle ?? "This session"}
              </span>{" "}
              can't be deleted because{submissionCount > 0 ? (
                <>
                  it already has {submissionCount} submission{
                    submissionCount === 1 ? "" : "s"
                  }. Archive it instead.
                </>
              ) : (
                <>
                  it is currently <span className="font-medium">open</span>.
                  Close it first.
                </>
              )}
            </DialogDescription>
          ) : (
            <DialogDescription>
              Are you sure you want to delete{" "}
              <span className="font-medium text-foreground">
                {session?.formTitle ?? "this session"}
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
              disabled={isPending || !session}
              onClick={() => session && onConfirm(session.id)}
            >
              {isPending ? "Deleting..." : "Delete Session"}
            </Button>
          ) : null}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
