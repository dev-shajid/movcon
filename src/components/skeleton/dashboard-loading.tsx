import { Skeleton } from '../ui/skeleton'
import { Card, CardContent } from '../ui/card'

export function StatsCardsLoading() {
    return (
        <div className="max-w-5xl mx-auto space-y-8">
            {/* Stats */}
            <div className="grid md:grid-cols-4 grid-cols-2 gap-4">
                {Array.from({ length: 4 }).map((_, index) => (
                    <Card key={index}>
                        <CardContent>
                            <Skeleton className="h-6 w-32 mb-4" />
                            <Skeleton className="size-10" />
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    )
}

export function GreetingCardLoading(){
    return (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 animate-fade-in">
            <div>
                <Skeleton className="h-6 w-56 inline-block" />
                <Skeleton className="h-4 w-32 mt-2" />
            </div>
        </div>
    );
}