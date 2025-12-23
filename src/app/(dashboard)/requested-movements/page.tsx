"use client"

import { useEffect, useState } from 'react';
import { getRequestedMovementsForRole } from '@/services/request.service';
import RequestedMovementsTable from './RequestedMovementsTable';
import TableLoading from '@/components/skeleton/table-loading';
import { useUserStore } from '@/hooks/use-user-store';

export default function RequestedMovementsPage() {
    const { user } = useUserStore();
    const [requests, setRequests] = useState<any[] | undefined>(undefined);
    const [loading, setLoading] = useState(true);

    async function fetchData() {
        setLoading(true);
        if (!user?.role) {
            setRequests([]);
            setLoading(false);
            return;
        }
        const reqs = await getRequestedMovementsForRole(user.role);
        setRequests(reqs || []);
        setLoading(false);
    }

    useEffect(() => {
        fetchData();
    }, []);

    let content = null;
    if (loading || typeof user === 'undefined' || typeof requests === 'undefined') {
        content = <TableLoading />;
    } else if (!user) {
        content = <div className="text-muted-foreground mt-8">You are not authorized to view this page.</div>;
    } else {
        content = <div className="w-full overflow-x-auto">
            <RequestedMovementsTable requests={requests} user={user} />
        </div>;
    }

    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold mb-6">Requested Movements</h1>
            {content}
        </div>
    );
}