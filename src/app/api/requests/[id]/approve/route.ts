
import { NextResponse } from 'next/server';
import { db, UserRole, RequestStatus } from '@/lib/mock-db';

export async function POST(
    request: Request,
    { params }: { params: Promise<{ id: string }> } // Params is a promise in Next.js 15+ (and 16)
) {
    try {
        const { id } = await params;
        const { status, approverRole } = await request.json();

        if (!status || !approverRole) {
            return NextResponse.json({ error: 'Missing status or approverRole' }, { status: 400 });
        }

        const updatedRequest = db.updateRequestStatus(id, status as RequestStatus, approverRole as UserRole);

        if (!updatedRequest) {
            return NextResponse.json({ error: 'Request not found' }, { status: 404 });
        }

        return NextResponse.json(updatedRequest);
    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
