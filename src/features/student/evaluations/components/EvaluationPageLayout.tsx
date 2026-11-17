import type { ReactNode } from "react";
import { EvaluationCardSkeleton } from "./EvaluationCardSkeleton";

interface EvaluationPageLayoutProps {
  title: string;
  description?: string;
  isLoading: boolean;
  isError: boolean;
  count: number;
  total: number;
  filters: ReactNode;
  children: ReactNode;
}

export function EvaluationPageLayout({
  title,
  description,
  isLoading,
  isError,
  count,
  total,
  filters,
  children,
}: EvaluationPageLayoutProps) {
  if (isLoading) {
    return (
      <div className="flex flex-col gap-6 w-full p-4 md:p-8 animate-pulse">
        <div className="h-10 w-48 bg-muted rounded-md" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <EvaluationCardSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-8 text-destructive">Failed to load evaluations.</div>
    );
  }

  return (
    <div className="flex flex-col gap-6 w-full p-4 md:p-8">
      {/* Header & Filters */}
      <div className="flex flex-col xl:flex-row items-start xl:items-end justify-between gap-6">
        <div className="shrink-0">
          <h1 className="text-2xl font-bold tracking-tight capitalize">
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
      <div className="rounded-xl border border-hairline bg-card shadow-sm p-4 md:p-6">
        {count === 0 ? (
          <div className="flex flex-col items-center justify-center p-10 text-center">
            <p className="font-medium">No evaluations found</p>
            <p className="text-sm text-muted-foreground mt-1">
              Try adjusting your filters or check back later.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {children}
          </div>
        )}
      </div>
    </div>
  );
}
