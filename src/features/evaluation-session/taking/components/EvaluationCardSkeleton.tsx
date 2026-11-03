import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function EvaluationCardSkeleton() {
  return (
    <Card className="gap-4 px-6 shadow-sm">
      <div className="flex items-center justify-between">
        <Skeleton className="h-5 w-32 rounded-full" />
        <Skeleton className="h-5 w-20 rounded-full" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-6 w-48" />
        <Skeleton className="h-4 w-64" />
      </div>
      <Skeleton className="h-14 w-full rounded-lg" />
      <div className="flex items-center justify-between border-t pt-4">
        <Skeleton className="h-4 w-36" />
        <Skeleton className="h-9 w-36" />
      </div>
    </Card>
  );
}
