import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { Facility } from "../types";

interface DeleteFacilityDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  facility?: Facility | null;
  onConfirm: (facilityId: number) => void;
  isPending?: boolean;
  error?: string | null;
}

export function DeleteFacilityDialog({
  open,
  onOpenChange,
  facility = null,
  onConfirm,
  isPending = false,
  error = null,
}: DeleteFacilityDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Facility</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete{" "}
            <span className="font-medium text-foreground">
              {facility?.facilityName ?? "this facility"}
            </span>
            ? This action can't be undone.
          </DialogDescription>
        </DialogHeader>
        <p className="text-xs text-muted-foreground">
          Evaluations tied to this facility may be affected. The server will
          reject the request if deletion isn't allowed.
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
            disabled={isPending || !facility}
            onClick={() => facility && onConfirm(facility.facilityId)}>
            {isPending ? "Deleting..." : "Delete Facility"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
