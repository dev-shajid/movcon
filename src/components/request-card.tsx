'use client'

import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { StatusBadge } from './status-badge';
import { Calendar, MapPin, Truck, User, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { formatDate } from '@/lib/utils';
import { IMovementRequest } from '@/models/MovementRequest';

interface RequestCardProps {
  request: IMovementRequest;
  showActions?: boolean;
}

export function RequestCard({ request, showActions = true }: RequestCardProps) {
    const router = useRouter()

  return (
    <Card className="card-hover animate-fade-in">
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
        <div className="space-y-1">
          <p className="text-sm font-medium text-muted-foreground">
            {request.requestNumber}
          </p>
          <h3 className="font-semibold text-lg">{request.vehicleNumber}</h3>
        </div>
        <StatusBadge status={request.status} />
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Truck className="h-4 w-4" />
            <span>{request.vehicleType}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <User className="h-4 w-4" />
            <span>{request.driverName}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <MapPin className="h-4 w-4" />
            <span className="truncate">{request.destination}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>{formatDate(new Date(request.departureDate))}</span>
          </div>
        </div>

        <p className="text-sm text-muted-foreground line-clamp-2">
          {request.purpose}
        </p>

        {showActions && (
          <Button
            variant="outline"
            className="w-full group"
            onClick={() => router.push(`/requests/${request._id}`)}
          >
            View Details
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
