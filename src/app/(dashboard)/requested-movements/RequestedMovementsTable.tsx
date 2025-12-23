"use client";

import { useRouter } from 'next/navigation';
import { StatusBadge } from '@/components/status-badge';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Eye, Check, X, FileText } from 'lucide-react';
import { toast } from 'sonner';
import { approveRequest, rejectRequest } from '@/services/request.service';
import { useState } from 'react';
import { IMovementRequest } from '@/models/MovementRequest';

export default function RequestedMovementsTable({ requests, user }: { requests: IMovementRequest[], user: any }) {
    const router = useRouter();
    const [loadingId, setLoadingId] = useState<string | null>(null);

    async function handleApprove(request: IMovementRequest) {
        setLoadingId(String(request._id));
        try {
            await approveRequest({
                requestId: String(request._id),
                user: {
                    id: user.id ?? '',
                    name: user.name ?? '',
                    role: user.role ?? '',
                },
            });
            toast("Request Approved", { description: `Request ${request.requestNumber} has been approved.` });
        } catch (err: any) {
            toast.error("Approval failed", { description: err.message || 'Error approving request.' });
        } finally {
            setLoadingId(null);
        }
    }

    async function handleReject(request: IMovementRequest) {
        setLoadingId(String(request._id));
        try {
            await rejectRequest({
                requestId: String(request._id),
                user: {
                    id: user.id ?? '',
                    name: user.name ?? '',
                    role: user.role ?? '',
                },
                remarks: '',
            });
            toast.error("Request Rejected", { description: `Request ${request.requestNumber} has been rejected.` });
            router.refresh();
        } catch (err: any) {
            toast.error("Rejection failed", { description: err.message || 'Error rejecting request.' });
        } finally {
            setLoadingId(null);
        }
    }

    if (requests.length === 0) return (
        <div className="text-center py-12 bg-muted/50 rounded-lg">
            <FileText className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
            <p className="text-muted-foreground">No requests found</p>
        </div>
    )

    return (
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
                {requests.map((request, i) => (
                    <TableRow key={i}>
                        <TableCell className="font-medium">{request.requestNumber}</TableCell>
                        <TableCell>
                            <div>
                                <p className="font-medium">{request.vehicleNumber}</p>
                                <p className="text-xs text-muted-foreground">{request.vehicleType}</p>
                            </div>
                        </TableCell>
                        <TableCell>{request.driverName}</TableCell>
                        <TableCell className="max-w-50 truncate">{request.destination}</TableCell>
                        <TableCell>
                            <div className="text-sm">
                                <p>{request.departureDate}</p>
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
                                    href={`/requests/${request._id}`}
                                >
                                    <Eye className="h-4 w-4" />
                                </Button>
                                <>
                                    <Button
                                        size="sm"
                                        className="bg-green-500 hover:bg-green-600 text-wh"
                                        disabled={loadingId === String(request?._id)}
                                        onClick={() => handleApprove(request)}
                                    >
                                        <Check className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        size="sm"
                                        className="bg-red-500 hover:bg-red-600 text-wh"
                                        disabled={loadingId === String(request._id)}
                                        onClick={() => handleReject(request)}
                                    >
                                        <X className="h-4 w-4" />
                                    </Button>
                                </>
                            </div>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}
