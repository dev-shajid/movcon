
'use client';

import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function ClientApprovalButtons({
    requestId,
    nextStatus,
    userRole
}: {
    requestId: string,
    nextStatus: string,
    userRole: string
}) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const handleAction = async (status: string) => {
        setLoading(true);
        await fetch(`/api/requests/${requestId}/approve`, {
            method: 'POST',
            body: JSON.stringify({
                status: status,
                approverRole: userRole
            }),
            headers: { 'Content-Type': 'application/json' },
        });
        setLoading(false);
        router.refresh();
    };

    return (
        <>
            <Button
                variant="destructive"
                disabled={loading}
                onClick={() => handleAction('REJECTED')}
            >
                Reject
            </Button>
            <Button
                variant="default"
                disabled={loading}
                className="bg-green-600 hover:bg-green-700 text-white"
                onClick={() => handleAction(nextStatus)}
            >
                Approve & Forward
            </Button>
        </>
    );
}
