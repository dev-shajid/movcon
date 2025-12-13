'use client'

import { StatusBadge } from '@/components/status-badge';
import { useAuth } from '@/context/auth.context';
import { mockRequests } from '@/data/mockData';
import { ROLE_LABELS, STATUS_LABELS } from '@/types';
import { ClipboardList, FileText, Check, X, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { formatDate } from '@/lib/utils';

export default function Approvals() {
    const { user } = useAuth();
    const router = useRouter()

    if (!user) return null;

    const roleStatusMap: Record<string, string> = {
        adjutant: 'pending_adjutant',
        co: 'pending_co',
        gso1: 'pending_gso1',
        col_staff: 'pending_col_staff',
    };

    const pendingStatus = roleStatusMap[user.role];
    const pendingRequests = mockRequests.filter(r => r.status === pendingStatus);

    const handleApprove = (requestNumber: string) => {
        toast.success("Request Approved", {
            description: `Request ${requestNumber} has been approved. (Demo mode)`,
        });
    };

    const handleReject = (requestNumber: string) => {
        toast.error("Request Rejected", {
            description: `Request ${requestNumber} has been rejected. (Demo mode)`,
        });
    };

    return (
        <div className="space-y-6">
            <div className="animate-fade-in">
                <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
                    <ClipboardList className="h-6 w-6" />
                    Pending Approvals
                </h1>
                <p className="text-muted-foreground">
                    Requests awaiting your approval as {ROLE_LABELS[user.role]}
                </p>
            </div>

            <Card className="animate-fade-in">
                <CardHeader>
                    <CardTitle>Pending Requests ({pendingRequests.length})</CardTitle>
                </CardHeader>
                <CardContent>
                    {pendingRequests.length > 0 ? (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Request #</TableHead>
                                    <TableHead>Vehicle</TableHead>
                                    <TableHead>Driver</TableHead>
                                    <TableHead>Destination</TableHead>
                                    <TableHead>Departure</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {pendingRequests.map((request) => (
                                    <TableRow key={request.id}>
                                        <TableCell className="font-medium">
                                            {request.requestNumber}
                                        </TableCell>
                                        <TableCell>
                                            <div>
                                                <p className="font-medium">{request.vehicleNumber}</p>
                                                <p className="text-xs text-muted-foreground">{request.vehicleType}</p>
                                            </div>
                                        </TableCell>
                                        <TableCell>{request.driverName}</TableCell>
                                        <TableCell className="max-w-[200px] truncate">
                                            {request.destination}
                                        </TableCell>
                                        <TableCell>
                                            <div className="text-sm">
                                                <p>{formatDate(new Date(request.departureDate))}</p>
                                                <p className="text-xs text-muted-foreground">{request.departureTime}</p>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <StatusBadge status={request.status} />
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex gap-2">
                                                <Button
                                                    size="sm"
                                                    variant="ghost"
                                                    onClick={() => router.push(`/requests/${request.id}`)}
                                                >
                                                    <Eye className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    className='bg-green-500 hover:bg-green-600'
                                                    onClick={() => handleApprove(request.requestNumber)}
                                                >
                                                    <Check className="h-4 w-4 mr-1" />
                                                    Approve
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="destructive"
                                                    onClick={() => handleReject(request.requestNumber)}
                                                >
                                                    <X className="h-4 w-4 mr-1" />
                                                    Reject
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    ) : (
                        <div className="text-center py-12 bg-muted/50 rounded-lg">
                            <FileText className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
                            <p className="text-lg font-medium text-foreground">All caught up!</p>
                            <p className="text-muted-foreground">
                                No requests pending your approval
                            </p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
