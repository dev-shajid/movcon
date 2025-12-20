'use client'

import { useState, useEffect } from 'react';
import { StatusBadge } from '@/components/status-badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Filter, FileText, Eye, Check, X } from 'lucide-react';
import { RequestStatus, STATUS_LABELS } from '@/types';
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
import { useUserStore } from '@/hooks/use-user-store';

export default function RequestsPage() {
    const { user } = useUserStore();
    const router = useRouter();
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [requests, setRequests] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) return;
        setLoading(true);
        fetch('/api/requests')
            .then(res => res.json())
            .then(data => {
                setRequests(data.requests || []);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, [user]);

    if (!user) return null;

    // Filter requests by role (mimic getRequestsForRole logic)
    const getRequestsForRole = (role: string) => {
        switch (role) {
            case 'mt_office':
                return requests;
            case 'adjutant':
                return requests.filter(r => r.status === 'pending_adjutant' || r.approvalHistory?.some((h: any) => h.role === 'adjutant'));
            case 'co':
                return requests.filter(r => r.status === 'pending_co' || r.approvalHistory?.some((h: any) => h.role === 'co'));
            case 'gso1':
                return requests.filter(r => r.status === 'pending_gso1' || r.approvalHistory?.some((h: any) => h.role === 'gso1'));
            case 'col_staff':
                return requests.filter(r => r.status === 'pending_col_staff' || r.status === 'approved' || r.approvalHistory?.some((h: any) => h.role === 'col_staff'));
            case 'mp_checkpost':
                return requests.filter(r => r.status === 'approved');
            default:
                return [];
        }
    };

    const allRequests = getRequestsForRole(user.role);

    const filteredRequests = allRequests.filter(request => {
        const matchesSearch =
            request.vehicleNumber.toLowerCase().includes(search.toLowerCase()) ||
            request.requestNumber.toLowerCase().includes(search.toLowerCase()) ||
            request.destination.toLowerCase().includes(search.toLowerCase());
        const matchesStatus = statusFilter === 'all' || request.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const canApprove = (status: RequestStatus) => {
        const roleStatusMap: Record<string, string> = {
            adjutant: 'pending_adjutant',
            co: 'pending_co',
            gso1: 'pending_gso1',
            col_staff: 'pending_col_staff',
        };
        return roleStatusMap[user.role] === status;
    };

    const handleApprove = (requestNumber: string) => {
        toast("Request Approved", {
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
                <h1 className="text-2xl font-bold text-foreground">All Requests</h1>
                <p className="text-muted-foreground">
                    View and manage movement requests
                </p>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search by vehicle, request number, or destination..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-10"
                    />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-full sm:w-48">
                        <Filter className="h-4 w-4 mr-2" />
                        <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        {Object.entries(STATUS_LABELS).map(([value, label]) => (
                            <SelectItem key={value} value={value}>
                                {label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            {/* Requests Table */}
            <Card className="animate-fade-in">
                <CardHeader>
                    <CardTitle>Movement Requests ({filteredRequests.length})</CardTitle>
                </CardHeader>
                <CardContent>
                    {filteredRequests.length > 0 ? (
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
                                {filteredRequests.map((request) => (
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
                                        <TableCell className="max-w-50 truncate">
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
                                                {canApprove(request.status) && (
                                                    <>
                                                        <Button
                                                            size="sm"
                                                            className="bg-green-500 hover:bg-green-600"
                                                            onClick={() => handleApprove(request.requestNumber)}
                                                        >
                                                            <Check className="h-4 w-4" />
                                                        </Button>
                                                        <Button
                                                            size="sm"
                                                            className="bg-red-500 hover:bg-red-600"
                                                            onClick={() => handleReject(request.requestNumber)}
                                                        >
                                                            <X className="h-4 w-4" />
                                                        </Button>
                                                    </>
                                                )}
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    ) : (
                        <div className="text-center py-12 bg-muted/50 rounded-lg">
                            <FileText className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
                            <p className="text-muted-foreground">No requests found</p>
                            <p className="text-sm text-muted-foreground">
                                Try adjusting your search or filter criteria
                            </p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}