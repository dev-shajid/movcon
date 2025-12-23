'use client'

import { createRequest } from '@/services/request.service';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Send, Truck, MapPin, Calendar } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useUserStore } from '@/hooks/use-user-store';
import { useForm, Controller } from 'react-hook-form';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Field, FieldError, FieldGroup, FieldLabel, FieldDescription } from '@/components/ui/field';


const MovementRequestSchema = z.object({
    vehicleNumber: z.string().min(1, 'Vehicle Number is required.'),
    vehicleType: z.string().min(1, 'Vehicle Type is required.'),
    driverName: z.string().min(1, 'Driver Name is required.'),
    driverContact: z.string().min(1, 'Driver Contact is required.'),
    purpose: z.string().min(1, 'Purpose is required.'),
    destination: z.string().min(1, 'Destination is required.'),
    route: z.string().min(1, 'Route is required.'),
    departureDate: z.string().min(1, 'Departure Date is required.'),
    departureTime: z.string().min(1, 'Departure Time is required.'),
    returnDate: z.string().min(1, 'Expected Return Date is required.'),
    returnTime: z.string().min(1, 'Expected Return Time is required.'),
});

export default function NewRequest() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
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

    const form = useForm<z.infer<typeof MovementRequestSchema>>({
        resolver: zodResolver(MovementRequestSchema),
        defaultValues: {
            vehicleNumber: 'ARMY-4521',
            vehicleType: 'Toyota Land Cruiser',
            driverName: 'Cpl Saleem',
            driverContact: '+92-321-1234567',
            purpose: 'Official duty - Equipment transport to forward base',
            destination: 'Forward Base Delta',
            route: 'HQ → Checkpoint Alpha → Forward Base Delta',
            departureDate: '2025-12-25',
            departureTime: '08:00',
            returnDate: '2025-12-26',
            returnTime: '18:00',
        },
    });

    async function onSubmit(data: z.infer<typeof MovementRequestSchema>) {
        setIsLoading(true);
        setError(null);
        try {
            await createRequest({
                vehicleNumber: data.vehicleNumber,
                vehicleType: data.vehicleType,
                driverName: data.driverName,
                driverContact: data.driverContact,
                purpose: data.purpose,
                destination: data.destination,
                route: data.route,
                departureDate: data.departureDate,
                departureTime: data.departureTime,
                expectedReturnDate: data.returnDate, // map to expectedReturnDate
                expectedReturnTime: data.returnTime, // map to expectedReturnTime
                createdBy: user?.id,
            });
            toast('Request Submitted', {
                description: 'Your movement request has been submitted for approval.',
            });
            router.push('/requests');
        } catch (err) {
            setError('Failed to submit request');
        } finally {
            setIsLoading(false);
        }
    }

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

            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FieldGroup>
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
                            <Controller
                                name="vehicleNumber"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel htmlFor={field.name}>Vehicle Number</FieldLabel>
                                        <Input {...field} id={field.name} type="text" aria-invalid={fieldState.invalid} placeholder="e.g., ARMY-4521" />
                                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                    </Field>
                                )}
                            />
                            <Controller
                                name="vehicleType"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel htmlFor={field.name}>Vehicle Type</FieldLabel>
                                        <Input {...field} id={field.name} type="text" aria-invalid={fieldState.invalid} placeholder="e.g., Toyota Land Cruiser" />
                                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                    </Field>
                                )}
                            />
                            <Controller
                                name="driverName"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel htmlFor={field.name}>Driver Name</FieldLabel>
                                        <Input {...field} id={field.name} type="text" aria-invalid={fieldState.invalid} placeholder="e.g., Cpl Saleem" />
                                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                    </Field>
                                )}
                            />
                            <Controller
                                name="driverContact"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel htmlFor={field.name}>Driver Contact</FieldLabel>
                                        <Input {...field} id={field.name} type="text" aria-invalid={fieldState.invalid} placeholder="e.g., +92-321-1234567" />
                                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                    </Field>
                                )}
                            />
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
                            <Controller
                                name="purpose"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel htmlFor={field.name}>Purpose of Movement</FieldLabel>
                                        <Textarea {...field} id={field.name} aria-invalid={fieldState.invalid} placeholder="e.g., Official duty - Equipment transport to forward base" />
                                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                    </Field>
                                )}
                            />
                            <Controller
                                name="destination"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel htmlFor={field.name}>Destination</FieldLabel>
                                        <Input {...field} id={field.name} type="text" aria-invalid={fieldState.invalid} placeholder="e.g., Forward Base Delta" />
                                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                    </Field>
                                )}
                            />
                            <Controller
                                name="route"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel htmlFor={field.name}>Route</FieldLabel>
                                        <Input {...field} id={field.name} type="text" aria-invalid={fieldState.invalid} placeholder="e.g., HQ → Checkpoint Alpha → Forward Base Delta" />
                                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                    </Field>
                                )}
                            />
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
                            <Controller
                                name="departureDate"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel htmlFor={field.name}>Departure Date</FieldLabel>
                                        <Input {...field} id={field.name} type="date" aria-invalid={fieldState.invalid} />
                                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                    </Field>
                                )}
                            />
                            <Controller
                                name="departureTime"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel htmlFor={field.name}>Departure Time</FieldLabel>
                                        <Input {...field} id={field.name} type="time" aria-invalid={fieldState.invalid} />
                                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                    </Field>
                                )}
                            />
                            <Controller
                                name="returnDate"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel htmlFor={field.name}>Expected Return Date</FieldLabel>
                                        <Input {...field} id={field.name} type="date" aria-invalid={fieldState.invalid} />
                                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                    </Field>
                                )}
                            />
                            <Controller
                                name="returnTime"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel htmlFor={field.name}>Expected Return Time</FieldLabel>
                                        <Input {...field} id={field.name} type="time" aria-invalid={fieldState.invalid} />
                                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                    </Field>
                                )}
                            />
                        </CardContent>
                    </Card>

                    {error && (
                        <div className="rounded-md bg-destructive/7 border border-destructive/20 p-3 text-sm text-destructive">
                            {error}
                        </div>
                    )}

                    {/* Submit Button */}
                    <Field>
                        <div className="flex justify-end gap-3">
                            <Button type="button" variant="outline" onClick={() => router.back()}>
                                Cancel
                            </Button>
                            <Button type="submit" disabled={isLoading}>
                                {isLoading ? (
                                    <>Submitting...</>
                                ) : (
                                    <>
                                        <Send className="h-4 w-4 mr-2" />
                                        Submit Request
                                    </>
                                )}
                            </Button>
                        </div>
                    </Field>
                </FieldGroup>
            </form>
        </div>
    );
}