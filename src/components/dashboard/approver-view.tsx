
'use client';

import { User, MovementRequest, RequestStatus } from '@/lib/mock-db';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ApproverView({ user }: { user: User }) {
    const [requests, setRequests] = useState<MovementRequest[]>([]);
    const router = useRouter();

    useEffect(() => {
        fetch('/api/requests')
            .then(res => res.json())
            .then((data: MovementRequest[]) => {
                // Filter requests that are pending for THIS user's role
                // MT_OFFICE -> [PENDING_ADJUTANT] -> ADJUTANT -> [PENDING_CO] -> CO ...

                let targetStatus: RequestStatus | null = null;
                if (user.role === 'ADJUTANT') targetStatus = 'PENDING_ADJUTANT';
                if (user.role === 'CO') targetStatus = 'PENDING_CO';
                if (user.role === 'GSO1') targetStatus = 'PENDING_GSO1';
                if (user.role === 'COL_STAFF') targetStatus = 'PENDING_COL_STAFF';

                const pending = data.filter(r => r.status === targetStatus);
                setRequests(pending);
            });
    }, [user.role]);

    return (
        <div className="space-y-6">
            <h2 className="text-xl font-semibold">Pending Approvals ({requests.length})</h2>
            <div className="grid gap-4">
                {requests.map(req => (
                    <Card key={req.id}>
                        <CardHeader className="pb-2">
                            <div className="flex justify-between">
                                <CardTitle className="text-lg">{req.vehicleNumber}</CardTitle>
                                <span className="text-xs font-mono bg-zinc-100 p-1 rounded">ID: {req.id}</span>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-2 gap-2 mb-4">
                                <div>
                                    <p className="text-xs text-muted-foreground">Purpose</p>
                                    <p className="text-sm font-medium">{req.purpose}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-muted-foreground">Date</p>
                                    <p className="text-sm font-medium">{new Date(req.dateTime).toLocaleString()}</p>
                                </div>
                                <div className="col-span-2">
                                    <p className="text-xs text-muted-foreground">Route</p>
                                    <p className="text-sm">{req.route}</p>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <Button
                                    className="w-full"
                                    variant="default"
                                    onClick={() => router.push(`/requests/${req.id}`)}
                                >
                                    Review Request
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
                {requests.length === 0 && <p className="text-muted-foreground">No pending requests for your review.</p>}
            </div>
        </div>
    );
}
