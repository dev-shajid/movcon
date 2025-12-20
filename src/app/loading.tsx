import { Skeleton } from '@/components/ui/skeleton'

export default function DashboardLoading() {
    return (
        <div className="h-screen flex items-center justify-center">
            <div className="p-6 space-y-4 max-w-lg w-full">
                <Skeleton className="h-10 w-1/3" />
                <Skeleton className="h-10 w-2/3" />
                <Skeleton className="h-10 w-full" />
            </div>
        </div>
    )
}
