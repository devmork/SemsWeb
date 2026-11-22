import { useMemo, useState, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  IconChartBar,
  IconBuilding,
  IconInbox,
  IconTrash,
} from "@tabler/icons-react";
import { useSessions } from "@/features/qa/sessions";
import {
  useDeleteFacilitySubmission,
  useFacilityDetail,
  useFacilitySessionSubmissions,
  useFacilitySummary,
} from "../hooks/useFacilityReports";
import type {
  FacilityResultQuery,
  FacilitySubmission,
  FacilitySummary,
} from "../types";

function formatRating(value: number | null): string {
  return value === null ? "—" : value.toFixed(2);
}

function mutationErrorMessage(error: unknown): string | null {
  if (!error) return null;
  if (typeof error === "object" && "response" in error) {
    const response = (error as { response?: { data?: { message?: string } } })
      .response;
    if (response?.data?.message) return response.data.message;
  }
  return "Something went wrong. Please try again.";
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

function RatingBar({ value }: { value: number | null }) {
  const pct = value === null ? 0 : Math.max(0, Math.min(100, (value / 5) * 100));
  return (
    <div className="flex items-center gap-2">
      <div className="h-1.5 w-24 overflow-hidden rounded-full bg-muted">
        <div
          className="h-full rounded-full bg-brand-accent"
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="text-sm font-medium tabular-nums text-foreground">
        {formatRating(value)}
      </span>
    </div>
  );
}

function SummaryTable({
  summary,
  selectedFacilityId,
  onSelect,
}: {
  summary: FacilitySummary[];
  selectedFacilityId: number;
  onSelect: (facilityId: number) => void;
}) {
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
      <table className="w-full text-left">
        <thead>
          <tr className="border-b border-border bg-muted/50">
            <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Facility
            </th>
            <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Responses
            </th>
            <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Average Rating
            </th>
          </tr>
        </thead>
        <tbody>
          {summary.map((row) => (
            <tr
              key={row.facilityId}
              onClick={() => onSelect(row.facilityId)}
              aria-selected={selectedFacilityId === row.facilityId}
              className={`cursor-pointer border-b border-border last:border-0 transition-colors hover:bg-muted/40 ${
                selectedFacilityId === row.facilityId ? "bg-muted/60" : ""
              }`}>
              <td className="px-5 py-3 text-sm font-medium text-foreground">
                {row.facilityName}
              </td>
              <td className="px-5 py-3 text-sm tabular-nums text-muted-foreground">
                {row.responseCount}
              </td>
              <td className="px-5 py-3">
                <RatingBar value={row.averageRating} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function FacilityDetailPanel({
  facilityId,
  query,
}: {
  facilityId: number;
  query: FacilityResultQuery;
}) {
  const { data, isPending, isError, error } = useFacilityDetail(
    facilityId,
    query,
  );

  if (isPending) {
    return (
      <div className="space-y-3 rounded-xl border border-border bg-card p-5 shadow-sm">
        <Skeleton className="h-4 w-40" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
      </div>
    );
  }

  if (isError || !data) {
    return (
      <StateCard
        icon={<IconChartBar className="size-5" />}
        title="Couldn't load facility results"
        description={
          error instanceof Error
            ? error.message
            : "Check your connection and try again."
        }
        tone="error"
      />
    );
  }

  return (
    <div className="flex flex-col gap-4 rounded-xl border border-border bg-card p-5 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h2 className="text-base font-semibold text-foreground">
            {data.facilityName}
          </h2>
          <p className="text-sm text-muted-foreground">
            {data.responseCount} response{data.responseCount === 1 ? "" : "s"}
          </p>
        </div>
        <div className="text-right">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Overall
          </p>
          <p className="text-lg font-semibold tabular-nums text-foreground">
            {formatRating(data.averageRating)}
            <span className="text-sm font-normal text-muted-foreground">/5</span>
          </p>
        </div>
      </div>

      <div className="overflow-hidden rounded-lg border border-border">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              <th className="px-4 py-2.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Category
              </th>
              <th className="px-4 py-2.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Weight
              </th>
              <th className="px-4 py-2.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Responses
              </th>
              <th className="px-4 py-2.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Average
              </th>
            </tr>
          </thead>
          <tbody>
            {data.categories.map((category) => (
              <tr
                key={category.categoryId}
                className="border-b border-border last:border-0">
                <td className="px-4 py-2.5 text-sm text-foreground">
                  {category.categoryName ??
                    `Category ${category.categoryId}`}
                </td>
                <td className="px-4 py-2.5 text-sm tabular-nums text-muted-foreground">
                  {category.categoryRate === null
                    ? "—"
                    : `${category.categoryRate}%`}
                </td>
                <td className="px-4 py-2.5 text-sm tabular-nums text-muted-foreground">
                  {category.responseCount}
                </td>
                <td className="px-4 py-2.5">
                  <RatingBar value={category.averageRating} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col gap-3">
        {data.categories.map((category) => {
          const questions = data.questions.filter(
            (question) => question.categoryId === category.categoryId,
          );
          if (questions.length === 0) return null;
          return (
            <div key={category.categoryId} className="space-y-1.5">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                {category.categoryName ?? `Category ${category.categoryId}`}
              </p>
              <ul className="divide-y divide-border rounded-lg border border-border">
                {questions.map((question) => (
                  <li
                    key={question.questionId}
                    className="flex items-center justify-between gap-4 px-4 py-2.5">
                    <span className="text-sm text-foreground">
                      {question.questionName ??
                        `Question ${question.questionId}`}
                    </span>
                    <span className="flex items-center gap-3 text-sm tabular-nums text-muted-foreground">
                      <span>{question.responseCount} resp.</span>
                      <span className="font-medium text-foreground">
                        {formatRating(question.averageRating)}
                      </span>
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function SubmissionsPanel({ sessionId }: { sessionId: number }) {
  const { data, isPending, isError, error } =
    useFacilitySessionSubmissions(sessionId);
  const {
    mutate: deleteSubmission,
    isPending: isDeleting,
    error: deleteError,
    reset: resetDeleteError,
  } = useDeleteFacilitySubmission();
  const [pendingDelete, setPendingDelete] =
    useState<FacilitySubmission | null>(null);

  const deleteSubmitError = mutationErrorMessage(deleteError);

  const handleConfirm = () => {
    if (!pendingDelete) return;
    deleteSubmission(pendingDelete.submissionId, {
      onSuccess: () => setPendingDelete(null),
    });
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-semibold text-foreground">
            Session submissions
          </h2>
          <p className="text-sm text-muted-foreground">
            Reset a submission to let a student evaluate the facility again.
          </p>
        </div>
      </div>

      {isPending ? (
        <div className="space-y-2 rounded-xl border border-border bg-card p-4 shadow-sm">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-9 w-full" />
          ))}
        </div>
      ) : isError ? (
        <StateCard
          icon={<IconInbox className="size-5" />}
          title="Couldn't load submissions"
          description={
            error instanceof Error
              ? error.message
              : "Check your connection and try again."
          }
          tone="error"
        />
      ) : !data || data.length === 0 ? (
        <StateCard
          icon={<IconInbox className="size-5" />}
          title="No submissions yet"
          description="Students haven't submitted a facility evaluation for this session."
        />
      ) : (
        <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Student
                </th>
                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Facility
                </th>
                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Submitted
                </th>
                <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {data.map((submission) => (
                <tr
                  key={submission.submissionId}
                  className="border-b border-border last:border-0 transition-colors hover:bg-muted/40">
                  <td className="px-5 py-3">
                    <p className="text-sm font-medium text-foreground">
                      {submission.studentName}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {submission.studentNumber}
                    </p>
                  </td>
                  <td className="px-5 py-3 text-sm text-foreground">
                    {submission.facilityName}
                  </td>
                  <td className="px-5 py-3 text-sm text-muted-foreground">
                    {new Date(submission.submittedAtUtc).toLocaleString()}
                  </td>
                  <td className="px-5 py-3 text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                      onClick={() => {
                        resetDeleteError();
                        setPendingDelete(submission);
                      }}>
                      <IconTrash /> Reset
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Dialog
        open={!!pendingDelete}
        onOpenChange={(open) => {
          if (!open) setPendingDelete(null);
        }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reset submission?</DialogTitle>
            <DialogDescription>
              This permanently deletes{" "}
              {pendingDelete ? `${pendingDelete.studentName}'s` : "the"} facility
              evaluation. The student will be able to submit it again.
            </DialogDescription>
          </DialogHeader>
          {deleteSubmitError ? (
            <p role="alert" className="text-sm text-destructive">
              {deleteSubmitError}
            </p>
          ) : null}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setPendingDelete(null)}
              disabled={isDeleting}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleConfirm}
              disabled={isDeleting}>
              {isDeleting ? "Resetting…" : "Reset submission"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export function FacilityResults() {
  const { data: sessions } = useSessions();
  const [sessionFilter, setSessionFilter] = useState("all");
  const [selectedFacilityId, setSelectedFacilityId] = useState(0);

  const selectedSession = useMemo(
    () => sessions?.find((s) => String(s.id) === sessionFilter) ?? null,
    [sessions, sessionFilter],
  );

  const query = useMemo<FacilityResultQuery>(
    () => (selectedSession ? { sessionId: selectedSession.id } : {}),
    [selectedSession],
  );

  // A facility selected under one session may have no data under another,
  // so the selection resets whenever the session filter changes.
  const handleSessionChange = (value: string | null) => {
    setSessionFilter(value ?? "all");
    setSelectedFacilityId(0);
  };

  const {
    data: summary,
    isPending,
    isError,
    error,
  } = useFacilitySummary(query);

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            Facility Results
          </h1>
          <p className="text-sm text-muted-foreground">
            Response counts and average ratings per facility, with per-category
            and per-question breakdowns.
          </p>
        </div>
        <div className="flex w-full flex-col gap-1.5 sm:w-72">
          <span className="text-xs font-medium text-muted-foreground">
            Session
          </span>
          <Select
            value={sessionFilter}
            onValueChange={handleSessionChange}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="All sessions" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All sessions</SelectItem>
              {(sessions ?? []).map((session) => (
                <SelectItem key={session.id} value={String(session.id)}>
                  {`${session.formTitle} · ${session.schoolYear} T${session.term}`}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </header>

      {isPending ? (
        <div className="space-y-2 rounded-xl border border-border bg-card p-4 shadow-sm">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-10 w-full" />
          ))}
        </div>
      ) : isError ? (
        <StateCard
          icon={<IconChartBar className="size-5" />}
          title="Couldn't load facility results"
          description={
            error instanceof Error
              ? error.message
              : "Check your connection and try again."
          }
          tone="error"
        />
      ) : !summary || summary.length === 0 ? (
        <StateCard
          icon={<IconBuilding className="size-5" />}
          title="No facility results yet"
          description="Results appear once students submit facility evaluations for this session."
        />
      ) : (
        <SummaryTable
          summary={summary}
          selectedFacilityId={selectedFacilityId}
          onSelect={(facilityId) =>
            setSelectedFacilityId((current) =>
              current === facilityId ? 0 : facilityId,
            )
          }
        />
      )}

      {selectedFacilityId > 0 ? (
        <FacilityDetailPanel
          facilityId={selectedFacilityId}
          query={query}
        />
      ) : summary && summary.length > 0 ? (
        <p className="text-sm text-muted-foreground">
          Select a facility to see its category and question breakdown.
        </p>
      ) : null}

      {selectedSession ? (
        <SubmissionsPanel sessionId={selectedSession.id} />
      ) : null}
    </div>
  );
}
