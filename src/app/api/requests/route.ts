
import { NextResponse } from 'next/server';
import { db } from '@/lib/mock-db';

export async function GET(request: Request) {
    // In a real app, we'd check session here.
    // For now, return all requests. Filtering can be done on client or via query params.
    const requests = db.getRequests();
    return NextResponse.json(requests);
}

export async function POST(request: Request) {
    try {
        const data = await request.json();

        // Validate required fields (basic)
        if (!data.requesterId || !data.vehicleNumber || !data.purpose || !data.route || !data.dateTime) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const newRequest = db.createRequest({
            requesterId: data.requesterId,
            vehicleNumber: data.vehicleNumber,
            purpose: data.purpose,
            route: data.route,
            dateTime: data.dateTime,
        });

        return NextResponse.json(newRequest, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
