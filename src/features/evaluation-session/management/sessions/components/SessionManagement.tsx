import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useCloseSession,
  useCreateSession,
  useDeleteSession,
  useOpenSession,
  useSessions,
  useUpdateSession,
} from "../hooks/useSessions";
import type { CreateSessionInput, Session } from "../types";
import { SessionTable } from "./SessionTable";
import { SessionDialog } from "./SessionDialog";
import { DeleteSessionDialog } from "./DeleteSessionDialog";

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

function SessionCardSkeleton() {
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

export function SessionManagement() {
  const { data: sessions = [], isLoading, error } = useSessions();
  const {
    mutate: createSession,
    isPending: isCreating,
    error: createError,
    reset: resetCreateError,
  } = useCreateSession();
  const {
    mutate: updateSession,
    isPending: isUpdating,
    error: updateError,
    reset: resetUpdateError,
  } = useUpdateSession();
  const {
    mutate: deleteSession,
    isPending: isDeleting,
  } = useDeleteSession();
  const { mutate: openSession } = useOpenSession();
  const { mutate: closeSession } = useCloseSession();

  const [sessionDialogOpen, setSessionDialogOpen] = useState(false);
  const [editingSession, setEditingSession] = useState<Session | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingSession, setDeletingSession] = useState<Session | null>(null);
  const [query, setQuery] = useState("");

  const trimmedQuery = query.trim().toLowerCase();
  const filteredSessions = useMemo(
    () =>
      trimmedQuery
        ? sessions.filter(
            (s) =>
              s.formTitle.toLowerCase().includes(trimmedQuery) ||
              s.formCode.toLowerCase().includes(trimmedQuery) ||
              s.schoolYear.toLowerCase().includes(trimmedQuery),
          )
        : sessions,
    [sessions, trimmedQuery],
  );

  const submitError =
    mutationErrorMessage(createError) ?? mutationErrorMessage(updateError);

  const handleSessionSubmit = (input: CreateSessionInput | Parameters<typeof updateSession>[0]["input"]) => {
    const onSuccess = () => {
      setSessionDialogOpen(false);
      setEditingSession(null);
    };
    if (editingSession) {
      updateSession({ id: editingSession.id, input }, { onSuccess });
    } else {
      createSession(input as CreateSessionInput, { onSuccess });
    }
  };

  const handleDeleteConfirm = (id: number) => {
    deleteSession(id, {
      onSuccess: () => {
        setDeleteDialogOpen(false);
        setDeletingSession(null);
      },
    });
  };

  const handleOpenConfirm = (session: Session) => {
    openSession(session.id, {
      onSuccess: () => {
        setEditingSession(null);
      },
    });
  };

  const handleCloseConfirm = (session: Session) => {
    closeSession(session.id, {
      onSuccess: () => {
        setEditingSession(null);
      },
    });
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-lg font-semibold">Evaluation Sessions</h1>
        <Button
          onClick={() => {
            setEditingSession(null);
            resetCreateError();
            resetUpdateError();
            setSessionDialogOpen(true);
          }}
        >
          Add Session
        </Button>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search sessions..."
          aria-label="Search sessions"
          className="max-w-xs"
        />
      </div>

      {isLoading ? (
        <SessionCardSkeleton />
      ) : error ? (
        <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-hairline py-16 text-center">
          <p className="text-sm font-medium">Couldn't load sessions</p>
          <p className="text-sm text-muted-foreground">
            Check your connection and try again.
          </p>
          <Button variant="outline" size="sm" onClick={() => window.location.reload()}>
            Retry
          </Button>
        </div>
      ) : filteredSessions.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <p className="text-sm font-medium">No evaluation sessions yet</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Create a session to pair a form with a school year and term.
          </p>
        </div>
      ) : (
        <SessionTable
          sessions={filteredSessions}
          onEdit={(session) => {
            setEditingSession(session);
            resetCreateError();
            resetUpdateError();
            setSessionDialogOpen(true);
          }}
          onDelete={(session) => {
            setDeletingSession(session);
            setDeleteDialogOpen(true);
          }}
          onOpen={(session) => handleOpenConfirm(session)}
          onClose={(session) => handleCloseConfirm(session)}
        />
      )}

      <SessionDialog
        open={sessionDialogOpen}
        onOpenChange={(open) => {
          setSessionDialogOpen(open);
          if (!open) setEditingSession(null);
        }}
        session={editingSession}
        onSubmit={handleSessionSubmit}
        isPending={isCreating || isUpdating}
        submitError={submitError}
      />
      <DeleteSessionDialog
        open={deleteDialogOpen}
        onOpenChange={(open) => {
          setDeleteDialogOpen(open);
          if (!open) setDeletingSession(null);
        }}
        session={deletingSession}
        onConfirm={handleDeleteConfirm}
        isPending={isDeleting}
      />
    </div>
  );
}
