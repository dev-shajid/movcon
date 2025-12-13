'use client'

import { mockCheckpostLogs, mockRequests } from '@/data/mockData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from '@/components/ui/table';
import { FileText, LogIn, LogOut, Minus } from 'lucide-react';
import { format } from 'date-fns';

export default function CheckpostLogs() {
    const getRequestDetails = (requestId: string) => {
        return mockRequests.find(r => r.id === requestId);
    };

    return (
        <div className="space-y-6">
            <div className="animate-fade-in">
                <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
                    <FileText className="h-6 w-6" />
                    IN/OUT Logs
                </h1>
                <p className="text-muted-foreground">
                    Historical vehicle entry and exit records
                </p>
            </div>

            <Card className="animate-fade-in">
                <CardHeader>
                    <CardTitle>Movement History</CardTitle>
                </CardHeader>
                <CardContent>
                    {mockCheckpostLogs.length > 0 ? (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Vehicle</TableHead>
                                    <TableHead>Request #</TableHead>
                                    <TableHead>Destination</TableHead>
                                    <TableHead>
                                        <div className="flex items-center gap-1">
                                            <LogOut className="h-4 w-4" />
                                            OUT Time
                                        </div>
                                    </TableHead>
                                    <TableHead>
                                        <div className="flex items-center gap-1">
                                            <LogIn className="h-4 w-4" />
                                            IN Time
                                        </div>
                                    </TableHead>
                                    <TableHead>Duration</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {mockCheckpostLogs.map((log) => {
                                    const request = getRequestDetails(log.requestId);
                                    const outTime = log.outTime ? new Date(log.outTime) : null;
                                    const inTime = log.inTime ? new Date(log.inTime) : null;

                                    let duration = '-';
                                    if (outTime && inTime) {
                                        const diff = inTime.getTime() - outTime.getTime();
                                        const hours = Math.floor(diff / (1000 * 60 * 60));
                                        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
                                        duration = `${hours}h ${minutes}m`;
                                    }

                                    return (
                                        <TableRow key={log.id}>
                                            <TableCell>
                                                {format(new Date(log.date), 'MMM dd, yyyy')}
                                            </TableCell>
                                            <TableCell className="font-medium">
                                                {log.vehicleNumber}
                                            </TableCell>
                                            <TableCell>
                                                {request?.requestNumber || '-'}
                                            </TableCell>
                                            <TableCell>
                                                {request?.destination || '-'}
                                            </TableCell>
                                            <TableCell>
                                                {outTime ? (
                                                    <span className="text-warning font-medium">
                                                        {format(outTime, 'HH:mm')}
                                                    </span>
                                                ) : (
                                                    <Minus className="h-4 w-4 text-muted-foreground" />
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                {inTime ? (
                                                    <span className="text-success font-medium">
                                                        {format(inTime, 'HH:mm')}
                                                    </span>
                                                ) : (
                                                    <Minus className="h-4 w-4 text-muted-foreground" />
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                <span className="text-muted-foreground">{duration}</span>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    ) : (
                        <div className="text-center py-8">
                            <FileText className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
                            <p className="text-muted-foreground">No logs recorded yet</p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
