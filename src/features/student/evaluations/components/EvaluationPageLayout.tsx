import type { ReactNode } from "react";
import { EvaluationCardSkeleton } from "./EvaluationCardSkeleton";

interface EvaluationPageLayoutProps {
  title: string;
  description?: string;
  isLoading: boolean;
  isError: boolean;
  /** The query error, so the message can say what actually failed. */
  error?: unknown;
  count: number;
  total: number;
  filters: ReactNode;
  children: ReactNode;
}

/** Pull a useful message out of an axios error, or fall back to a generic one. */
function toErrorMessage(error: unknown): string {
  if (error && typeof error === "object" && "response" in error) {
    const response = (
      error as {
        response?: { status?: number; data?: { message?: string; title?: string } };
      }
    ).response;

    const detail = response?.data?.message ?? response?.data?.title;
    if (detail) {
      return response?.status ? `${detail} (HTTP ${response.status})` : detail;
    }
    if (response?.status) {
      return `Request failed with HTTP ${response.status}.`;
    }
  }

  return "Check your connection and try again.";
}

export function EvaluationPageLayout({
  title,
  description,
  isLoading,
  isError,
  error,
  count,
  total,
  filters,
  children,
}: EvaluationPageLayoutProps) {
  if (isLoading) {
    return (
      <div
        className="flex min-w-0 flex-col gap-6 w-full py-2 md:py-4 animate-pulse motion-reduce:animate-none"
        role="status"
        aria-live="polite"
        aria-label="Loading evaluations">
        <div className="h-10 w-48 bg-muted rounded-md" />
        <div className="grid min-w-0 grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <EvaluationCardSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div
        role="alert"
        className="rounded-xl border border-destructive/30 bg-destructive/5 p-6 text-center text-sm text-destructive">
        Failed to load evaluations. {toErrorMessage(error)} Try refreshing the
        page or check your connection.
      </div>
    );
  }

  return (
    <div className="flex min-w-0 flex-col gap-6 w-full py-2 md:py-4">
      {/* Header & Filters */}
      <div className="flex flex-col xl:flex-row items-start xl:items-end justify-between gap-4">
        <div className="min-w-0">
          <h1 className="text-2xl font-bold tracking-tight capitalize break-words">
            {title}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Showing {count} of {total} records
            {description && ` • ${description}`}
          </p>
        </div>
        {filters}
      </div>

      {/* Content Area */}
      <div className="min-w-0 rounded-xl border border-hairline bg-card shadow-sm p-3 md:p-6">
        {count === 0 ? (
          <div className="flex flex-col items-center justify-center p-10 text-center">
            <p className="font-medium">No evaluations found</p>
            <p className="text-sm text-muted-foreground mt-1">
              Try adjusting your filters or check back later.
            </p>
          </div>
        ) : (
          <div className="grid min-w-0 grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-6">
            {children}
          </div>
        )}
      </div>
    </div>
  );
}
