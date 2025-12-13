
'use client';

import { User } from '@/lib/mock-db';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useEffect, useState } from 'react';
import { MovementRequest } from '@/lib/mock-db';

export default function MtOfficeView({ user }: { user: User }) {
    const [requests, setRequests] = useState<MovementRequest[]>([]);

    useEffect(() => {
        fetch('/api/requests')
            .then(res => res.json())
            .then(data => setRequests(data));
    }, []);

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">My Requests</h2>
                <Button onClick={() => window.location.href = '/requests/new'}>New Movement Request</Button>
            </div>

            <div className="grid gap-4">
                {requests.map(req => (
                    <Card key={req.id}>
                        <CardHeader className="pb-2">
                            <div className="flex justify-between">
                                <CardTitle className="text-lg">{req.vehicleNumber}</CardTitle>
                                <span className={`px-2 py-1 rounded text-xs font-bold ${req.status === 'APPROVED' ? 'bg-green-100 text-green-800' :
                                    req.status === 'REJECTED' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                                    }`}>
                                    {req.status}
                                </span>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground">{req.purpose}</p>
                            <p className="text-sm mt-1">Route: {req.route}</p>
                            <p className="text-sm">Date: {new Date(req.dateTime).toLocaleString()}</p>
                        </CardContent>
                    </Card>
                ))}
                {requests.length === 0 && <p className="text-muted-foreground">No requests found.</p>}
            </div>
        </div>
    );
}
