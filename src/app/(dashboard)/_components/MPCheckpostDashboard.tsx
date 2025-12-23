import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getAllRequests } from '@/services/request.service';
import { useUserStore } from '@/hooks/use-user-store';

export default function MPCheckpostDashboard() {
    const { user } = useUserStore();
    const [approvedRequests, setApprovedRequests] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        getAllRequests()
        .then((data:any) => {
            setApprovedRequests(data.approved || []);
            setLoading(false);
        }).catch(() => setLoading(false));
    }, []);

    // Compose rank + name for welcome
    const rank = user?.rank ? user.rank + ' ' : '';
    const name = user?.name ? user.name.split(' ').pop() : 'MP';

    return (
        <div className="max-w-5xl mx-auto py-8 space-y-8">
            {/* Welcome Section */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 animate-fade-in">
                <div>
                    <h1 className="text-2xl font-bold text-foreground">
                        <span role="img" aria-label="guard" className="mr-2">🛡️</span>
                        Welcome, {rank}{name}
                    </h1>
                    <p className="text-muted-foreground">MP Checkpost Dashboard</p>
                </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Card>
                    <CardHeader>
                        <CardTitle>Approved Movements</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {loading ? <div className="h-8 w-16 bg-muted rounded animate-pulse" /> : <span className="text-2xl font-bold text-green-600">{approvedRequests.length}</span>}
                    </CardContent>
                </Card>
            </div>
            {/* Removed table/list. Only showing stats above for a clean dashboard. */}
        </div>
    );
}
