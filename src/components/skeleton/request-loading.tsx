import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export default function RequestLoading() {
  return (
    <div className="space-y-6">
      {/* Header Skeleton */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <Skeleton className="h-10 w-24 rounded" />
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <Skeleton className="h-8 w-40 rounded" />
            <Skeleton className="h-6 w-20 rounded" />
          </div>
          <Skeleton className="h-4 w-32 mt-2 rounded" />
        </div>
        <Skeleton className="h-10 w-40 rounded" />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Details Skeleton */}
        <div className="lg:col-span-2 space-y-6">
          {/* Vehicle Info */}
          <Card>
            <CardHeader>
              <CardTitle>
                <Skeleton className="h-6 w-32 rounded" />
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              <Skeleton className="h-6 w-40 rounded mb-2" />
              <Skeleton className="h-6 w-40 rounded mb-2" />
              <Skeleton className="h-6 w-40 rounded mb-2" />
              <Skeleton className="h-6 w-40 rounded mb-2" />
            </CardContent>
          </Card>

          {/* Movement Info */}
          <Card>
            <CardHeader>
              <CardTitle>
                <Skeleton className="h-6 w-32 rounded" />
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Skeleton className="h-6 w-48 rounded mb-2" />
              <Skeleton className="h-6 w-48 rounded mb-2" />
              <div className="grid gap-4 sm:grid-cols-2">
                <Skeleton className="h-6 w-40 rounded mb-2" />
                <Skeleton className="h-6 w-40 rounded mb-2" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Approval Timeline Skeleton */}
        <div>
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <Skeleton className="h-6 w-40 rounded mb-2" />
                <Skeleton className="h-6 w-40 rounded mb-2" />
                <Skeleton className="h-6 w-40 rounded mb-2" />
                <Skeleton className="h-6 w-40 rounded mb-2" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
