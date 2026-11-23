import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ResponsiveTable } from "@/shared/components/ResponsiveTable";
import type { Session } from "../types";
import {
  formatGradeRange,
  sessionStatusLabel,
  sessionStatusVariant,
} from "../types";
import { semesterLabel } from "@/shared/lib/semester";
import { IconEdit, IconTrash } from "@tabler/icons-react";

interface SessionTableProps {
  sessions: Session[];
  onEdit?: (session: Session) => void;
  onDelete?: (session: Session) => void;
  onOpen?: (session: Session) => void;
  onClose?: (session: Session) => void;
}

export function SessionTable({
  sessions,
  onEdit,
  onDelete,
  onOpen,
  onClose,
}: SessionTableProps) {
  return (
    <ResponsiveTable
      ariaLabel="Evaluation sessions"
      minWidth="960px"
      items={sessions}
      rowKey={(session) => session.id}
      columns={[
        {
          header: "Form",
          primary: true,
          cell: (session) => (
            <span className="font-medium text-foreground">
              {session.formTitle}
            </span>
          ),
        },
        {
          header: "School year",
          cell: (session) => session.schoolYear,
        },
        {
          header: "Semester",
          cell: (session) => (
            <span className="text-muted-foreground">
              {semesterLabel(session.term)}
            </span>
          ),
        },
        {
          header: "Grades",
          cell: (session) => (
            <span className="text-muted-foreground">
              {formatGradeRange(session.gradeLevelFrom, session.gradeLevelTo)}
            </span>
          ),
        },
        {
          header: "Opens",
          cell: (session) => (
            <span className="tabular-nums text-muted-foreground">
              {session.opensAtUtc
                ? new Date(session.opensAtUtc).toLocaleDateString()
                : "—"}
            </span>
          ),
        },
        {
          header: "Closes",
          cell: (session) => (
            <span className="tabular-nums text-muted-foreground">
              {session.closesAtUtc
                ? new Date(session.closesAtUtc).toLocaleDateString()
                : "—"}
            </span>
          ),
        },
        {
          header: "Status",
          cell: (session) => (
            <Badge variant={sessionStatusVariant(session.status)}>
              {sessionStatusLabel(session.status)}
            </Badge>
          ),
        },
        {
          header: "Submissions",
          cell: (session) => (
            <span className="tabular-nums text-muted-foreground">
              {session.submissionCount}
            </span>
          ),
        },
        {
          header: "Created",
          mobileHidden: true,
          className: "text-muted-foreground",
          cell: (session) =>
            new Date(session.createdAtUtc).toLocaleDateString(),
        },
      ]}
      actions={(session) => (
        <>
          {session.status === "Draft" ? (
            <Button
              variant="outline"
              size="sm"
              aria-label={`Open ${session.formTitle}`}
              disabled={session.submissionCount > 0}
              onClick={() => onOpen?.(session)}>
              Open
            </Button>
          ) : null}
          {session.status === "Open" ? (
            <Button
              variant="outline"
              size="sm"
              aria-label={`Close ${session.formTitle}`}
              onClick={() => onClose?.(session)}>
              Close
            </Button>
          ) : null}
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label={`Edit ${session.formTitle}`}
            onClick={() => onEdit?.(session)}>
            <IconEdit />
          </Button>
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label={`Delete ${session.formTitle}`}
            className="text-destructive hover:bg-destructive/10 hover:text-destructive"
            onClick={() => onDelete?.(session)}>
            <IconTrash />
          </Button>
        </>
      )}
    />
  );
}
