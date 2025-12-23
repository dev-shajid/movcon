import { Suspense } from 'react';
import RequestedMovementsTable from './RequestedMovementsTable';
import { useUserStore } from '@/hooks/use-user-store';
import TableLoading from '@/components/skeleton/table-loading';

export default function RequestedMovementsPage() {
    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold mb-6">Requested Movements</h1>
            <div className="w-full overflow-x-auto">
                <Suspense fallback={<TableLoading />}>
                    <RequestedMovementsTable />
                </Suspense>
            </div>
        </div>
    );
}