'use client'

import { useEffect, useState } from 'react';
import { getCheckpostRequests, ICheckpostRequest } from '@/services/request.service';
import { getAllCheckpostLogs, createCheckpostLog, updateCheckpostLog } from '@/services/checkpost-log.service';
import { useUserStore } from '@/hooks/use-user-store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from '@/components/ui/table';
import { Shield, Truck, LogIn, LogOut, Clock } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';
import TableLoading from '@/components/skeleton/table-loading';
import { ICheckpostLog } from '@/models/CheckpostLog';
import { Schema } from 'mongoose';

export default function Movements() {
    const { user } = useUserStore();
    const [movements, setMovements] = useState<ICheckpostRequest[]>([]);
    const [loading, setLoading] = useState(true);
    const [updatingLogs, setUpdatingLogs] = useState<string[]>([]);

    async function fetchData() {
        setLoading(true);
        const reqRes = await getCheckpostRequests(user?.role);
        setMovements(reqRes)
        setLoading(false);
    }

    useEffect(() => {
        fetchData();
    }, []);

    const handleLogEntry = async (movement: ICheckpostRequest, type: 'in' | 'out') => {
        if (!user) return;
        setUpdatingLogs((prev) => [...prev, movement._id?.toString()]);

        const today = new Date().toISOString().slice(0, 10);
        try {
            if (type === 'out') {
                let data: Partial<ICheckpostLog> = {
                    requestId: movement._id?.toString?.() as unknown as Schema.Types.ObjectId,
                    vehicleNumber: movement.vehicleNumber,
                    loggedBy: user.id,
                    date: today,
                    outTime: new Date().toISOString(),
                };
                await createCheckpostLog(data);
                toast('OUT Time Logged', { description: `${movement.vehicleNumber} exit recorded at ${format(new Date(), 'HH:mm')}` });
                setMovements((prev) =>
                    prev.map((mv) => {
                        if (mv._id === movement._id) {
                            mv.vehicleIn = false;
                        }
                        return mv;
                    })
                );
            } else if (type === 'in') {
                const res = await updateCheckpostLog(movement._id, today);
                if (res) {
                    toast('IN Time Logged', { description: `${movement.vehicleNumber} entry recorded at ${format(new Date(), 'HH:mm')}` });
                    setMovements((prev) =>
                        prev.map((mv) => {
                            if (mv._id === movement._id) {
                                mv.vehicleIn = true;
                            }
                            return mv;
                        })
                    );
                }
                else toast.error('No existing OUT log found for today');
            }
        } catch (e: any) {
            toast.error('Failed to log', { description: e.message });
        } finally {
            setUpdatingLogs((prev) => prev.filter((id) => id !== movement._id?.toString()));
        }
    };

    return (
        <div className="space-y-6">
            <div className="animate-fade-in">
                <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
                    <Shield className="h-6 w-6" />
                    Permitted Movements
                </h1>
                <p className="text-muted-foreground">
                    View approved movements and log vehicle entry/exit
                </p>
            </div>

            <Card className="animate-fade-in">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Truck className="h-5 w-5" />
                        Today's Approved Movements
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {loading ? <TableLoading />
                        : movements.length > 0 ? (
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Request #</TableHead>
                                        <TableHead>Vehicle</TableHead>
                                        <TableHead>Driver</TableHead>
                                        <TableHead>Destination</TableHead>
                                        <TableHead>Schedule</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {movements.map((movement) => {
                                        return (
                                            <TableRow key={movement._id.toString()}>
                                                <TableCell className="font-medium">
                                                    {movement.requestNumber}
                                                </TableCell>
                                                <TableCell>
                                                    <div>
                                                        <p className="font-medium">{movement.vehicleNumber}</p>
                                                        <p className="text-xs text-muted-foreground">{movement.vehicleType}</p>
                                                    </div>
                                                </TableCell>
                                                <TableCell>{movement.driverName}</TableCell>
                                                <TableCell className="max-w-50 truncate">
                                                    {movement.destination}
                                                </TableCell>
                                                <TableCell>
                                                    <div className="text-sm">
                                                        <p>{movement.departureTime} - {movement.expectedReturnTime}</p>
                                                        <p className="text-xs text-muted-foreground">
                                                            {format(new Date(movement.departureDate), 'MMM dd')}
                                                        </p>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    {
                                                        movement.vehicleIn ?
                                                            <Badge variant="info">
                                                                Ready
                                                            </Badge> :
                                                            <Badge variant="pending">
                                                                In Transit
                                                            </Badge>
                                                    }
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex gap-2">
                                                        {
                                                            movement.vehicleIn ?
                                                                <Button
                                                                    size="sm"
                                                                    variant="outline"
                                                                    onClick={() => handleLogEntry(movement, 'out')}
                                                                    disabled={updatingLogs.includes(movement._id?.toString() || '')}
                                                                >
                                                                    <LogOut className="h-4 w-4 mr-1" />
                                                                    OUT
                                                                </Button> :
                                                                <Button
                                                                    size="sm"
                                                                    variant="outline"
                                                                    onClick={() => handleLogEntry(movement, 'in')}
                                                                    disabled={updatingLogs.includes(movement._id?.toString() || '')}
                                                                >
                                                                    <LogIn className="h-4 w-4 mr-1" />
                                                                    IN
                                                                </Button>

                                                        }
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}
                                </TableBody>
                            </Table>
                        ) : (
                            <div className="text-center py-8">
                                <Shield className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
                                <p className="text-muted-foreground">No approved movements for today</p>
                            </div>
                        )}
                </CardContent>
            </Card>
        </div>
    );
}