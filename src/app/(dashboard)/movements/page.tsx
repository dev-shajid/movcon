'use client'

import { mockRequests, mockCheckpostLogs } from '@/data/mockData';
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

export default function Movements() {
  const approvedMovements = mockRequests.filter(r => r.status === 'approved');

  const handleLogEntry = (vehicleNumber: string, type: 'in' | 'out') => {
    toast(`${type === 'out' ? 'OUT' : 'IN'} Time Logged`, {
      description: `${vehicleNumber} ${type === 'out' ? 'exit' : 'entry'} recorded at ${format(new Date(), 'HH:mm')}. (Demo mode)`,
    });
  };

  const getLogForRequest = (requestId: string) => {
    return mockCheckpostLogs.find(log => log.requestId === requestId && log.date === format(new Date(), 'yyyy-MM-dd'));
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
            {approvedMovements.length > 0 ? (
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
                  {approvedMovements.map((movement) => {
                    const todayLog = getLogForRequest(movement.id);
                    return (
                      <TableRow key={movement.id}>
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
                        <TableCell className="max-w-[200px] truncate">
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
                          {todayLog?.outTime && !todayLog?.inTime ? (
                            <Badge variant="warning">
                              <Clock className="h-3 w-3 mr-1" />
                              Out since {format(new Date(todayLog.outTime), 'HH:mm')}
                            </Badge>
                          ) : todayLog?.inTime ? (
                            <Badge variant="success">
                              Completed
                            </Badge>
                          ) : (
                            <Badge variant="info">Ready</Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleLogEntry(movement.vehicleNumber, 'out')}
                              disabled={todayLog?.outTime !== undefined}
                            >
                              <LogOut className="h-4 w-4 mr-1" />
                              OUT
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleLogEntry(movement.vehicleNumber, 'in')}
                              disabled={!todayLog?.outTime || todayLog?.inTime !== undefined}
                            >
                              <LogIn className="h-4 w-4 mr-1" />
                              IN
                            </Button>
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
