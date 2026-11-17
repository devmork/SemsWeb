import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useCreateFacility,
  useDeleteFacility,
  useFacilities,
  useUpdateFacility,
} from "../hooks/useFacilities";
import { FacilityDialog } from "./FacilityDialog";
import { DeleteFacilityDialog } from "./DeleteFacilityDialog";
import type { Facility, CreateFacilityInput } from "../types";
import { IconEdit, IconTrash, IconPlus } from "@tabler/icons-react";

function mutationErrorMessage(error: unknown): string | null {
  if (!error) return null;
  if (typeof error === "object" && "response" in error) {
    const response = (error as { response?: { data?: { message?: string } } })
      .response;
    if (response?.data?.message) return response.data.message;
  }
  return "Something went wrong. Please try again.";
}

function FacilityCardSkeleton() {
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

export function FacilityManagement() {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(query.trim()), 300);
    return () => clearTimeout(timer);
  }, [query]);

  const { data: facilities = [], isLoading, error } = useFacilities({
    search: debouncedQuery || undefined,
  });
  const {
    mutate: createFacility,
    isPending: isCreating,
    error: createError,
    reset: resetCreateError,
  } = useCreateFacility();
  const {
    mutate: updateFacility,
    isPending: isUpdating,
    error: updateError,
    reset: resetUpdateError,
  } = useUpdateFacility();
  const {
    mutate: deleteFacility,
    isPending: isDeleting,
    error: deleteError,
    reset: resetDeleteError,
  } = useDeleteFacility();

  const [facilityDialogOpen, setFacilityDialogOpen] = useState(false);
  const [editingFacility, setEditingFacility] = useState<Facility | null>(
    null,
  );
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingFacility, setDeletingFacility] = useState<Facility | null>(
    null,
  );

  const submitError =
    mutationErrorMessage(createError) ?? mutationErrorMessage(updateError);
  const deleteSubmitError = mutationErrorMessage(deleteError);

  type FacilityFormInput = CreateFacilityInput & { isActive?: boolean | undefined };

  const handleFacilitySubmit = (input: FacilityFormInput) => {
    const onSuccess = () => {
      setFacilityDialogOpen(false);
      setEditingFacility(null);
    };
    if (editingFacility) {
      updateFacility(
        {
          facilityId: editingFacility.facilityId,
          facilityName: input.facilityName,
          description: input.description,
          location: input.location,
          isActive: input.isActive,
        },
        { onSuccess },
      );
    } else {
      createFacility(input, { onSuccess });
    }
  };

  const handleDeleteConfirm = (facilityId: number) => {
    deleteFacility(facilityId, {
      onSuccess: () => {
        setDeleteDialogOpen(false);
        setDeletingFacility(null);
      },
    });
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-lg font-semibold">Facilities</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage campus facilities available for student evaluation.
          </p>
        </div>
        <Button
          onClick={() => {
            setEditingFacility(null);
            resetCreateError();
            resetUpdateError();
            setFacilityDialogOpen(true);
          }}>
          <IconPlus /> Add Facility
        </Button>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search facilities..."
          aria-label="Search facilities"
          className="max-w-xs"
        />
      </div>

      {isLoading ? (
        <FacilityCardSkeleton />
      ) : error ? (
        <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-hairline py-16 text-center">
          <p className="text-sm font-medium">Couldn't load facilities</p>
          <p className="text-sm text-muted-foreground">
            Check your connection and try again.
          </p>
          <Button variant="outline" size="sm" onClick={() => window.location.reload()}>
            Retry
          </Button>
        </div>
      ) : facilities.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <p className="text-sm font-medium">No facilities yet</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Register a facility to start managing campus locations.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-hairline">
          <table className="w-full min-w-[640px] text-left">
            <thead>
              <tr className="bg-canvas-soft">
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Name
                </th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Location
                </th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Description
                </th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Evaluations
                </th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Status
                </th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {facilities.map((facility) => (
                <tr
                  key={facility.facilityId}
                  className="border-t border-hairline hover:bg-muted/40">
                  <td className="px-4 py-3 text-sm font-medium">
                    {facility.facilityName}
                  </td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">
                    {facility.location ?? "—"}
                  </td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">
                    {facility.description ?? "—"}
                  </td>
                  <td className="px-4 py-3 text-sm tabular-nums">
                    {facility.evaluationCount}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    {facility.isActive ? (
                      <span className="inline-flex items-center rounded-full border border-success/20 bg-success/5 px-2.5 py-0.5 text-xs font-semibold text-success">
                        Active
                      </span>
                    ) : (
                      <span className="inline-flex items-center rounded-full border border-muted/40 bg-muted/5 px-2.5 py-0.5 text-xs font-semibold text-muted-foreground">
                        Inactive
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        aria-label={`Edit ${facility.facilityName}`}
                        onClick={() => {
                          setEditingFacility(facility);
                          resetCreateError();
                          resetUpdateError();
                          setFacilityDialogOpen(true);
                        }}>
                        <IconEdit />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        aria-label={`Delete ${facility.facilityName}`}
                        className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                        onClick={() => {
                          resetDeleteError();
                          setDeletingFacility(facility);
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

      <FacilityDialog
        open={facilityDialogOpen}
        onOpenChange={(open) => {
          setFacilityDialogOpen(open);
          if (!open) setEditingFacility(null);
        }}
        facility={editingFacility}
        onSubmit={handleFacilitySubmit}
        isPending={isCreating || isUpdating}
        submitError={submitError}
      />
      <DeleteFacilityDialog
        open={deleteDialogOpen}
        onOpenChange={(open) => {
          setDeleteDialogOpen(open);
          if (!open) setDeletingFacility(null);
        }}
        facility={deletingFacility}
        onConfirm={handleDeleteConfirm}
        isPending={isDeleting}
        error={deleteSubmitError}
      />
    </div>
  );
}
