import { useState, useEffect, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { ResponsiveTable } from "@/shared/components/ResponsiveTable";
import {
  IconEdit,
  IconTrash,
  IconPlus,
  IconBuilding,
} from "@tabler/icons-react";
import {
  useCreateFacility,
  useDeleteFacility,
  useFacilities,
  useUpdateFacility,
} from "../hooks/useFacilities";
import { FacilityDialog } from "./FacilityDialog";
import { DeleteFacilityDialog } from "./DeleteFacilityDialog";
import type { Facility, CreateFacilityInput } from "../types";

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
          <Skeleton className="h-5 w-16 rounded-full" />
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
  icon: ReactNode;
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

export function FacilityManagement() {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(query.trim()), 300);
    return () => clearTimeout(timer);
  }, [query]);

  const {
    data: facilities,
    isPending,
    isError,
    error,
  } = useFacilities({
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
  const [editingFacility, setEditingFacility] = useState<Facility | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingFacility, setDeletingFacility] = useState<Facility | null>(
    null,
  );

  const submitError =
    mutationErrorMessage(createError) ?? mutationErrorMessage(updateError);
  const deleteSubmitError = mutationErrorMessage(deleteError);

  type FacilityFormInput = CreateFacilityInput & {
    isActive?: boolean | undefined;
  };

  const openCreate = () => {
    setEditingFacility(null);
    resetCreateError();
    resetUpdateError();
    setFacilityDialogOpen(true);
  };

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
          isActive: input.isActive,
        },
        { onSuccess },
      );
    } else {
      createFacility({ facilityName: input.facilityName }, { onSuccess });
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
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            Facilities
          </h1>
          <p className="text-sm text-muted-foreground">
            Manage campus facilities available for student evaluation.
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative w-full sm:w-64">
            <IconBuilding
              className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground max-[320px]:hidden"
              aria-hidden
            />
            <Input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search facilities…"
              aria-label="Search facilities"
              className="pl-9 max-[320px]:pl-3"
            />
          </div>
          <Button onClick={openCreate}>
            <IconPlus /> Add Facility
          </Button>
        </div>
      </header>

      {isPending ? (
        <TableSkeleton />
      ) : isError ? (
        <StateCard
          icon={<IconBuilding className="size-5" />}
          title="Couldn't load facilities"
          description={
            error instanceof Error
              ? error.message
              : "Check your connection and try again."
          }
          tone="error"
        />
      ) : facilities && facilities.length > 0 ? (
        <ResponsiveTable
          ariaLabel="Campus facilities"
          minWidth="560px"
          items={facilities}
          rowKey={(facility) => facility.facilityId}
          columns={[
            {
              header: "Name",
              primary: true,
              cell: (facility) => (
                <span className="font-medium text-foreground">
                  {facility.facilityName}
                </span>
              ),
            },
            {
              header: "Status",
              cell: (facility) => (
                <span
                  className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    facility.isActive
                      ? "bg-success/10 text-success"
                      : "bg-muted text-muted-foreground"
                  }`}>
                  <span
                    className={`size-1.5 rounded-full ${
                      facility.isActive ? "bg-success" : "bg-muted-foreground"
                    }`}
                    aria-hidden
                  />
                  {facility.isActive ? "Active" : "Inactive"}
                </span>
              ),
            },
          ]}
          actions={(facility) => (
            <>
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
            </>
          )}
        />
      ) : (
        <StateCard
          icon={<IconBuilding className="size-5" />}
          title={debouncedQuery ? "No facilities found" : "No facilities yet"}
          description={
            debouncedQuery
              ? "Try a different name."
              : "Register a facility to start managing campus locations."
          }
        />
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
