'use client'

import { StatusBadge } from '@/components/status-badge';
import { ApprovalTimeline } from '@/components/approval-timeline';
import { useEffect, useState } from 'react';
import { getRequestById } from '@/services/request.service';
import { getCertificateByRequestId } from '@/services/certificate.service';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
    ArrowLeft,
    Truck,
    MapPin,
    Calendar,
    Clock,
    User,
    Phone,
    FileCheck,
    Download,
    CheckCircle,
    XCircle
} from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { formatDate } from '@/lib/utils';
import { toast } from 'sonner';
import { useUserStore } from '@/hooks/use-user-store';

export default function RequestDetailsPage() {
    const { id } = useParams<{ id: string }>();
    const router = useRouter();
    const { user } = useUserStore();
    const [remarks, setRemarks] = useState('');
    const [request, setRequest] = useState<any>(null);
    const [certificate, setCertificate] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            setLoading(true);
            try {
                const req = await getRequestById(id);
                setRequest(req);
                if (req) {
                    const cert = await getCertificateByRequestId(req._id.toString());
                    setCertificate(cert);
                } else {
                    setCertificate(null);
                }
            } catch (e) {
                setRequest(null);
                setCertificate(null);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, [id]);

    if (loading) {
        return (
            <div className="text-center py-12">
                <p className="text-muted-foreground">Loading...</p>
            </div>
        );
    }

    if (!request) {
        return (
            <div className="text-center py-12">
                <p className="text-muted-foreground">Request not found</p>
                <Button variant="outline" onClick={() => router.back()} className="mt-4">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Go Back
                </Button>
            </div>
        );
    }

    const canApprove = () => {
        if (!user) return false;
        const roleMap: Record<string, string> = {
            adjutant: 'pending_adjutant',
            co: 'pending_co',
            gso1: 'pending_gso1',
            col_staff: 'pending_col_staff',
        };
        return roleMap[user.role] === request.status;
    };

    const handleApproval = (action: 'approved' | 'rejected') => {
        // TODO: Implement real approval logic here
        const description = `The request has been ${action}.`;
        action === 'approved' ? toast.success('Request Approved', {
            description,
        }) : toast.error('Request Rejected', {
            description,
        });
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <Button variant="ghost" onClick={() => router.back()} className="w-fit">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back
                </Button>
                <div className="flex-1">
                    <div className="flex items-center gap-3">
                        <h1 className="text-2xl font-bold text-foreground">
                            {request.requestNumber}
                        </h1>
                        <StatusBadge status={request.status} />
                    </div>
                    <p className="text-muted-foreground">
                        Created on {formatDate(new Date(request.createdAt))}
                    </p>
                </div>
                {certificate && (
                    <Button variant="outline" className="w-fit">
                        <Download className="h-4 w-4 mr-2" />
                        Download Certificate
                    </Button>
                )}
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
                {/* Main Details */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Vehicle Info */}
                    <Card className="animate-fade-in">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <Truck className="h-5 w-5" />
                                Vehicle Details
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="grid gap-4 sm:grid-cols-2">
                            <div>
                                <p className="text-sm text-muted-foreground">Vehicle Number</p>
                                <p className="font-semibold">{request.vehicleNumber}</p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Vehicle Type</p>
                                <p className="font-semibold">{request.vehicleType}</p>
                            </div>
                            <div className="flex items-start gap-2">
                                <User className="h-4 w-4 mt-0.5 text-muted-foreground" />
                                <div>
                                    <p className="text-sm text-muted-foreground">Driver Name</p>
                                    <p className="font-semibold">{request.driverName}</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-2">
                                <Phone className="h-4 w-4 mt-0.5 text-muted-foreground" />
                                <div>
                                    <p className="text-sm text-muted-foreground">Contact</p>
                                    <p className="font-semibold">{request.driverContact}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Movement Info */}
                    <Card className="animate-fade-in" style={{ animationDelay: '100ms' }}>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <MapPin className="h-5 w-5" />
                                Movement Details
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <p className="text-sm text-muted-foreground">Purpose</p>
                                <p className="font-semibold">{request.purpose}</p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Route</p>
                                <p className="font-semibold">{request.route}</p>
                            </div>
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="flex items-start gap-2">
                                    <Calendar className="h-4 w-4 mt-0.5 text-muted-foreground" />
                                    <div>
                                        <p className="text-sm text-muted-foreground">Departure</p>
                                        <p className="font-semibold">
                                            {formatDate(new Date(request.departureDate))} at {request.departureTime}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-2">
                                    <Clock className="h-4 w-4 mt-0.5 text-muted-foreground" />
                                    <div>
                                        <p className="text-sm text-muted-foreground">Expected Return</p>
                                        <p className="font-semibold">
                                            {formatDate(new Date(request.expectedReturnDate))} at {request.expectedReturnTime}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Approval Actions */}
                    {canApprove() && (
                        <Card className="border-warning/50 animate-fade-in" style={{ animationDelay: '200ms' }}>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-lg">
                                    <FileCheck className="h-5 w-5" />
                                    Your Decision
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <p className="text-sm text-muted-foreground mb-2">Remarks (Optional)</p>
                                    <Textarea
                                        placeholder="Add any remarks or notes..."
                                        value={remarks}
                                        onChange={(e) => setRemarks(e.target.value)}
                                    />
                                </div>
                                <div className="flex gap-3">
                                    <Button
                                        className="flex-1 bg-success hover:bg-success/80 text-white"
                                        onClick={() => handleApproval('approved')}
                                    >
                                        <CheckCircle className="h-4 w-4 mr-2" />
                                        Approve
                                    </Button>
                                    <Button
                                        className="flex-1 bg-destructive hover:bg-destructive/80 text-white"
                                        onClick={() => handleApproval('rejected')}
                                    >
                                        <XCircle className="h-4 w-4 mr-2" />
                                        Reject
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>

                {/* Approval Timeline */}
                <div className="animate-fade-in" style={{ animationDelay: '150ms' }}>
                    <Card className="sticky top-24">
                        <CardContent className="pt-6">
                            <ApprovalTimeline
                                history={request.approvalHistory}
                                currentStatus={request.status}
                            />
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
