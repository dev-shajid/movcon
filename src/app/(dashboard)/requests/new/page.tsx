'use client'

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Send, Truck, MapPin, Calendar } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export default function NewRequest() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const router = useRouter()

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));

        toast('Request Submitted', {
            description: 'Your movement request has been submitted for approval. (Demo mode)',
        });

        setIsSubmitting(false);
        router.push('/requests');
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
                            <Input id="vehicleNumber" placeholder="e.g., ARMY-4521" required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="vehicleType">Vehicle Type *</Label>
                            <Input id="vehicleType" placeholder="e.g., Toyota Land Cruiser" required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="driverName">Driver Name *</Label>
                            <Input id="driverName" placeholder="e.g., Cpl Saleem" required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="driverContact">Driver Contact *</Label>
                            <Input id="driverContact" placeholder="e.g., +92-321-1234567" required />
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
                                placeholder="e.g., Official duty - Equipment transport to forward base"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="destination">Destination *</Label>
                            <Input id="destination" placeholder="e.g., Forward Base Delta" required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="route">Route *</Label>
                            <Input id="route" placeholder="e.g., HQ → Checkpoint Alpha → Forward Base Delta" required />
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
                            <Input type="date" id="departureDate" required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="departureTime">Departure Time *</Label>
                            <Input type="time" id="departureTime" required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="returnDate">Expected Return Date *</Label>
                            <Input type="date" id="returnDate" required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="returnTime">Expected Return Time *</Label>
                            <Input type="time" id="returnTime" required />
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
