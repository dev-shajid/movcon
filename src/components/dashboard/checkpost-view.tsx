
'use client';

import { User, MovementRequest, MovementLog } from '@/lib/mock-db';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useEffect, useState } from 'react';

export default function CheckpostView({ user }: { user: User }) {
    const [approvedRequests, setApprovedRequests] = useState<MovementRequest[]>([]);
    const [search, setSearch] = useState('');
    const [logs, setLogs] = useState<MovementLog[]>([]);

    const fetchData = () => {
        fetch('/api/requests')
            .then(res => res.json())
            .then((data: MovementRequest[]) => {
                setApprovedRequests(data.filter(r => r.status === 'APPROVED'));
            });

        fetch('/api/logs')
            .then(res => res.json())
            .then(setLogs);
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleLog = async (requestId: string, vehicleNumber: string, type: 'IN' | 'OUT') => {
        await fetch('/api/logs', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                requestId,
                vehicleNumber,
                type,
                recordedBy: user.id
            })
        });
        fetchData(); // Refresh logs
    };

    const filteredRequests = approvedRequests.filter(r =>
        r.vehicleNumber.toLowerCase().includes(search.toLowerCase())
    );

    // Get verify logs for a request to see if it's currently OUT or IN
    const getLastLog = (requestId: string) => {
        const requestLogs = logs.filter(l => l.requestId === requestId);
        return requestLogs[requestLogs.length - 1]; // Last log
    };

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-xl font-semibold mb-4">MP Checkpost - Vehicle Control</h2>
                <Input
                    placeholder="Search Vehicle Number..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="max-w-md mb-4"
                />

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {filteredRequests.map(req => {
                        const lastLog = getLastLog(req.id);
                        const isOut = lastLog?.type === 'OUT'; // If last was OUT, it's outside. If IN or no logs, it's inside/ready to go out?
                        // Actually, usually starts INSIDE (at unit). So first move is OUT.
                        // If last log is OUT, next is IN.
                        // If last log is IN (or undefined), next is OUT.

                        return (
                            <Card key={req.id} className="border-l-4 border-l-green-500">
                                <CardHeader className="pb-2">
                                    <CardTitle>{req.vehicleNumber}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-xs text-muted-foreground mb-2">Permitted until: {new Date(req.dateTime).toLocaleDateString()}</p>
                                    <p className="text-sm font-medium mb-4">{req.route}</p>

                                    <div className="flex gap-2">
                                        <Button
                                            disabled={isOut} // Can't go OUT if already OUT
                                            variant="outline"
                                            className="flex-1 border-red-200 hover:bg-red-50 text-red-700"
                                            onClick={() => handleLog(req.id, req.vehicleNumber, 'OUT')}
                                        >
                                            Log OUT
                                        </Button>
                                        <Button
                                            disabled={!isOut} // Can't come IN if not OUT
                                            variant="outline"
                                            className="flex-1 border-green-200 hover:bg-green-50 text-green-700"
                                            onClick={() => handleLog(req.id, req.vehicleNumber, 'IN')}
                                        >
                                            Log IN
                                        </Button>
                                    </div>
                                    {lastLog && (
                                        <p className="text-xs text-center mt-2 text-muted-foreground">
                                            Last: {lastLog.type} at {new Date(lastLog.timestamp).toLocaleTimeString()}
                                        </p>
                                    )}
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>
            </div>

            <div>
                <h3 className="text-lg font-semibold mb-2">Recent Activity Logs</h3>
                <div className="border rounded-md p-4 bg-zinc-50 dark:bg-zinc-900 max-h-[300px] overflow-auto">
                    {logs.slice().reverse().map(log => (
                        <div key={log.id} className="flex justify-between py-2 border-b last:border-0 text-sm">
                            <span><span className="font-bold">{log.vehicleNumber}</span> went {log.type}</span>
                            <span className="text-muted-foreground">{new Date(log.timestamp).toLocaleString()}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
