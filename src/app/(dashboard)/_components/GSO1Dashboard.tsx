
import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getRequestedMovementsForRole } from '@/services/request.service';
import { useUserStore } from '@/hooks/use-user-store';

export default function GSO1Dashboard() {
    const { user } = useUserStore();
    const [pendingRequests, setPendingRequests] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        getRequestedMovementsForRole('gso1').then((data) => {
            setPendingRequests(data || []);
            setLoading(false);
        }).catch(() => setLoading(false));
    }, []);

    // Compose rank + name for welcome
    const rank = user?.rank ? user.rank + ' ' : '';
    const name = user?.name ? user.name.split(' ').pop() : 'GSO1';

    return (
        <div className="max-w-3xl mx-auto py-10 space-y-8">
            {/* Welcome Section */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 animate-fade-in">
                <div>
                    <h1 className="text-2xl font-bold text-foreground">
                        <span role="img" aria-label="gso1" className="mr-2">📋</span>
                        Welcome, {rank}{name}
                    </h1>
                    <p className="text-muted-foreground mb-6">Here is a quick overview of your dashboard and pending tasks.</p>
                </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <Card className="shadow-md">
                    <CardHeader>
                        <CardTitle>Pending Requests</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {loading ? (
                            <div className="h-10 w-24 bg-muted rounded animate-pulse" />
                        ) : (
                            <span className="text-3xl font-bold text-yellow-600">{pendingRequests.length}</span>
                        )}
                        <div className="text-muted-foreground mt-2">Requests awaiting your review</div>
                    </CardContent>
                </Card>
                <Card className="shadow-md">
                    <CardHeader>
                        <CardTitle>Profile</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-1">
                            <div><span className="font-semibold">Name:</span> {user?.name || '-'}</div>
                            <div><span className="font-semibold">Role:</span> {user?.role || '-'}</div>
                            <div><span className="font-semibold">Email:</span> {user?.email || '-'}</div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
