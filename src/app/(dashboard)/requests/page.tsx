'use client'

import { useState, useEffect } from 'react';
import { StatusBadge } from '@/components/status-badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Filter, FileText, Eye, Check, X } from 'lucide-react';
import { STATUS_LABELS } from '@/types';
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
import { getAllRequests, approveRequest, rejectRequest } from '@/services/request.service';
import TableLoading from '@/components/skeleton/table-loading';
import { IMovementRequest } from '@/models/MovementRequest';

export default function RequestsPage() {
    const { user } = useUserStore();
    const router = useRouter();
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [loading, setLoading] = useState(true);
    const [requestsData, setRequestsData] = useState<{
        requests: IMovementRequest[];
        total: number;
        pending: number;
        approved: number;
        rejected: number;
    } | null>(null);

    async function fetchData() {
        setLoading(true);
        const data = await getAllRequests(user?.role);
        setRequestsData(data);
        setLoading(false);
    }

    useEffect(() => {
        fetchData();
    }, [user?.role]);


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
                    <CardTitle>Movement Requests ({requestsData?.total || 0})</CardTitle>
                </CardHeader>
                <CardContent>
                    {loading ? <TableLoading /> :
                        Number(requestsData?.total) > 0 ? (
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
                                    {requestsData?.requests?.map((request, i) => (
                                        <TableRow key={i}>
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
                                                        href={`/requests/${request._id}`}
                                                    >
                                                        <Eye className="h-4 w-4" />
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