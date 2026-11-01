import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function MyProfileSkeleton() {
  return (
    <div className="flex flex-col gap-6 w-full py-6 animate-pulse">
      {/* Header Skeleton */}
      <Card className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-6 shadow-sm border-hairline">
        <div className="space-y-2">
          <Skeleton className="h-7 w-32" />
          <Skeleton className="h-4 w-64" />
        </div>
        <Skeleton className="h-10 w-32 mt-4 sm:mt-0 rounded-md" />
      </Card>

      {/* Profile Skeleton */}
      <Card className="p-6 shadow-sm border-hairline flex flex-col sm:flex-row items-start sm:items-center gap-6">
        <Skeleton className="h-24 w-24 rounded-2xl shrink-0" />
        <div className="space-y-3 w-full">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-8 w-64" />
          <div className="flex gap-2">
            <Skeleton className="h-6 w-28 rounded-md" />
            <Skeleton className="h-6 w-32 rounded-md" />
            <Skeleton className="h-6 w-40 rounded-md" />
          </div>
        </div>
      </Card>

      {/* Grid Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="shadow-sm border-hairline overflow-hidden">
          <div className="border-b bg-muted/20 p-4">
            <Skeleton className="h-4 w-40" />
          </div>
          <CardContent className="pt-6 space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Skeleton className="h-3 w-16" />
                <Skeleton className="h-4 w-24" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-3 w-16" />
                <Skeleton className="h-4 w-24" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-3 w-16" />
                <Skeleton className="h-4 w-24" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-sm border-hairline overflow-hidden">
          <div className="border-b bg-muted/20 p-4">
            <Skeleton className="h-4 w-48" />
          </div>
          <CardContent className="pt-6 space-y-2">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-4 w-48" />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
