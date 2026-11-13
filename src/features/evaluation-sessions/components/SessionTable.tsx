import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Session } from "../types";
import { sessionStatusLabel, sessionStatusVariant } from "../types";
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
  if (sessions.length === 0) {
    return (
      <div className="overflow-hidden rounded-xl border border-hairline">
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <p className="text-sm font-medium">No evaluation sessions yet</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Create a session to pair a form with a school year and term.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-hairline">
      <table className="w-full min-w-[820px] text-left">
        <thead>
          <tr className="bg-canvas-soft">
            <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Form
            </th>
            <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              School Year
            </th>
            <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Term
            </th>
            <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Opens
            </th>
            <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Closes
            </th>
            <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Status
            </th>
            <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Submissions
            </th>
            <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Created
            </th>
            <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              <span className="sr-only">Actions</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {sessions.map((session) => (
            <tr
              key={session.id}
              className="border-t border-hairline hover:bg-muted/40"
            >
              <td className="px-4 py-3 text-sm font-medium">
                {session.formTitle}
              </td>
              <td className="px-4 py-3 text-sm">
                {session.schoolYear}
              </td>
              <td className="px-4 py-3 text-sm text-muted-foreground tabular-nums">
                {session.term}
              </td>
              <td className="px-4 py-3 text-sm text-muted-foreground">
                {session.opensAtUtc ? (
                  <span className="tabular-nums">
                    {new Date(session.opensAtUtc).toLocaleDateString()}
                  </span>
                ) : (
                  <span className="italic">—</span>
                )}
              </td>
              <td className="px-4 py-3 text-sm text-muted-foreground">
                {session.closesAtUtc ? (
                  <span className="tabular-nums">
                    {new Date(session.closesAtUtc).toLocaleDateString()}
                  </span>
                ) : (
                  <span className="italic">—</span>
                )}
              </td>
              <td className="px-4 py-3">
                <Badge variant={sessionStatusVariant(session.status)}>
                  {sessionStatusLabel(session.status)}
                </Badge>
              </td>
              <td className="px-4 py-3 text-sm text-muted-foreground tabular-nums">
                {session.submissionCount}
              </td>
              <td className="px-4 py-3 text-sm text-muted-foreground">
                {new Date(session.createdAtUtc).toLocaleDateString()}
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center justify-end gap-1">
                  {session.status === "Draft" ? (
                    <Button
                      variant="outline"
                      size="sm"
                      aria-label={`Open ${session.formTitle}`}
                      disabled={session.submissionCount > 0}
                      onClick={() => onOpen?.(session)}
                    >
                      Open
                    </Button>
                  ) : null}
                  {session.status === "Open" ? (
                    <Button
                      variant="outline"
                      size="sm"
                      aria-label={`Close ${session.formTitle}`}
                      onClick={() => onClose?.(session)}
                    >
                      Close
                    </Button>
                  ) : null}
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    aria-label={`Edit ${session.formTitle}`}
                    onClick={() => onEdit?.(session)}
                  >
                    <IconEdit />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    aria-label={`Delete ${session.formTitle}`}
                    className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                    onClick={() => onDelete?.(session)}
                  >
                    <IconTrash />
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
