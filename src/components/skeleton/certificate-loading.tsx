import { Card, CardContent } from '../ui/card'
import { Calendar, MapPin, Shield, Truck } from 'lucide-react'
import { Skeleton } from '../ui/skeleton'

export default function CertificateLoading() {
    return (
        <Card className="card-hover animate-fade-in overflow-hidden p-0">
            {/* Skeleton Certificate Header */}
            <div className="border-b p-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Shield className="h-8 w-8 opacity-60" />
                        <div>
                            <Skeleton className="h-3 w-32 rounded mb-1" />
                            <Skeleton className="h-5 w-24 rounded" />
                        </div>
                    </div>
                    <Skeleton className="h-6 w-20 rounded" />
                </div>
            </div>
            <CardContent className="p-4 space-y-4">
                {/* Vehicle Details Skeleton */}
                <div className="flex items-start gap-3">
                    <Truck className="h-5 w-5 text-muted-foreground/40 mt-0.5" />
                    <div className="flex-1 space-y-1">
                        <Skeleton className="h-3 w-16 rounded" />
                        <Skeleton className="h-4 w-28 rounded" />
                        <Skeleton className="h-3 w-32 rounded" />
                    </div>
                </div>
                {/* Route Details Skeleton */}
                <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-muted-foreground/40 mt-0.5" />
                    <div className="flex-1 space-y-1">
                        <Skeleton className="h-3 w-12 rounded" />
                        <Skeleton className="h-4 w-36 rounded" />
                        <Skeleton className="h-3 w-24 rounded" />
                    </div>
                </div>
                {/* Validity Skeleton */}
                <div className="flex items-start gap-3">
                    <Calendar className="h-5 w-5 text-muted-foreground/40 mt-0.5" />
                    <div className="flex-1 space-y-1">
                        <Skeleton className="h-3 w-20 rounded" />
                        <Skeleton className="h-4 w-32 rounded" />
                    </div>
                </div>
                {/* Authorization Skeleton */}
                <div className="pt-3 border-t">
                    <Skeleton className="h-3 w-16 rounded mb-1" />
                    <Skeleton className="h-4 w-24 rounded mb-1" />
                    <Skeleton className="h-3 w-28 rounded" />
                </div>
                {/* Actions Skeleton */}
                <div className="flex gap-2 pt-2">
                    <Skeleton className="h-10 w-full rounded" />
                    <Skeleton className="h-10 w-full rounded" />
                </div>
            </CardContent>
        </Card>
    )
}
