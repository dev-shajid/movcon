'use client'

import { createRequest } from '@/services/request.service';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Send, Truck, MapPin, Calendar } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useUserStore } from '@/hooks/use-user-store';

export default function NewRequest() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const router = useRouter();
    const { user } = useUserStore();

    // Only allow mt_office to access this page
    if (!user || user.role !== 'mt_office') {
        return (
            <div className="max-w-xl mx-auto mt-16 text-center">
                <h2 className="text-2xl font-bold mb-2">Access Denied</h2>
                <p className="text-muted-foreground mb-4">You do not have permission to create a new movement request.</p>
                <Button variant="outline" onClick={() => router.push('/requests')}>Go to Requests</Button>
            </div>
        );
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);

        const formData = new FormData(e.currentTarget);
        const data = {
            vehicleNumber: formData.get('vehicleNumber'),
            vehicleType: formData.get('vehicleType'),
            driverName: formData.get('driverName'),
            driverContact: formData.get('driverContact'),
            purpose: formData.get('purpose'),
            destination: formData.get('destination'),
            route: formData.get('route'),
            departureDate: formData.get('departureDate'),
            departureTime: formData.get('departureTime'),
            expectedReturnDate: formData.get('returnDate'),
            expectedReturnTime: formData.get('returnTime'),
            createdBy: user?.id,
        };

        try {
            await createRequest(data);
            toast('Request Submitted', {
                description: 'Your movement request has been submitted for approval.',
            });
            router.push('/requests');
        } catch (err) {
            toast.error('Failed to submit request');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Button variant="ghost" onClick={() => router.back()}>
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back
                </Button>
                <div>
                    <h1 className="text-2xl font-bold text-foreground">New Movement Request</h1>
                    <p className="text-muted-foreground">
                        Submit a new vehicle movement request for approval
                    </p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Vehicle Details */}
                <Card className="animate-fade-in">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-lg">
                            <Truck className="h-5 w-5" />
                            Vehicle Details
                        </CardTitle>
                        <CardDescription>
                            Enter the vehicle and driver information
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="vehicleNumber">Vehicle Number *</Label>
                            <Input id="vehicleNumber" name="vehicleNumber" placeholder="e.g., ARMY-4521" required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="vehicleType">Vehicle Type *</Label>
                            <Input id="vehicleType" name="vehicleType" placeholder="e.g., Toyota Land Cruiser" required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="driverName">Driver Name *</Label>
                            <Input id="driverName" name="driverName" placeholder="e.g., Cpl Saleem" required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="driverContact">Driver Contact *</Label>
                            <Input id="driverContact" name="driverContact" placeholder="e.g., +92-321-1234567" required />
                        </div>
                    </CardContent>
                </Card>

                {/* Movement Details */}
                <Card className="animate-fade-in" style={{ animationDelay: '100ms' }}>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-lg">
                            <MapPin className="h-5 w-5" />
                            Movement Details
                        </CardTitle>
                        <CardDescription>
                            Specify the purpose and route of movement
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="purpose">Purpose of Movement *</Label>
                            <Textarea
                                id="purpose"
                                name="purpose"
                                placeholder="e.g., Official duty - Equipment transport to forward base"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="destination">Destination *</Label>
                            <Input id="destination" name="destination" placeholder="e.g., Forward Base Delta" required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="route">Route *</Label>
                            <Input id="route" name="route" placeholder="e.g., HQ → Checkpoint Alpha → Forward Base Delta" required />
                        </div>
                    </CardContent>
                </Card>

                {/* Timing Details */}
                <Card className="animate-fade-in" style={{ animationDelay: '200ms' }}>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-lg">
                            <Calendar className="h-5 w-5" />
                            Schedule
                        </CardTitle>
                        <CardDescription>
                            Set the departure and expected return times
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="departureDate">Departure Date *</Label>
                            <Input type="date" id="departureDate" name="departureDate" required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="departureTime">Departure Time *</Label>
                            <Input type="time" id="departureTime" name="departureTime" required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="returnDate">Expected Return Date *</Label>
                            <Input type="date" id="returnDate" name="returnDate" required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="returnTime">Expected Return Time *</Label>
                            <Input type="time" id="returnTime" name="returnTime" required />
                        </div>
                    </CardContent>
                </Card>

                {/* Submit Button */}
                <div className="flex justify-end gap-3">
                    <Button type="button" variant="outline" onClick={() => router.back()}>
                        Cancel
                    </Button>
                    <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? (
                            <>Submitting...</>
                        ) : (
                            <>
                                <Send className="h-4 w-4 mr-2" />
                                Submit Request
                            </>
                        )}
                    </Button>
                </div>
            </form>
        </div>
    );
}