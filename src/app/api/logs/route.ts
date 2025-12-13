
import { NextResponse } from 'next/server';
import { db } from '@/lib/mock-db';

export async function GET() {
    const logs = db.getLogs();
    return NextResponse.json(logs);
}

export async function POST(request: Request) {
    try {
        const data = await request.json();

        if (!data.requestId || !data.vehicleNumber || !data.type || !data.recordedBy) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const newLog = db.logMovement({
            requestId: data.requestId,
            vehicleNumber: data.vehicleNumber,
            type: data.type,
            timestamp: new Date().toISOString(),
            recordedBy: data.recordedBy
        });

        return NextResponse.json(newLog, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
