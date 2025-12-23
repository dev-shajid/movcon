'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useUserStore } from "@/hooks/use-user-store";
import { IMovementRequest } from "@/models/MovementRequest";
import { getAllRequests } from "@/services/request.service";
import { useEffect, useState } from "react";
import DashboardLoading from "@/components/skeleton/dashboard-loading";
import { UserRole } from "@/lib/UserRole";
import AdminDashboard from "./AdminDashboard";


export default function DashboardContent() {
    const { user } = useUserStore();

    const [requestsData, setRequestsData] = useState<{
        requests: IMovementRequest[];
        total: number;
        pending: number;
        approved: number;
        rejected: number;
    } | null>(null);

    async function fetchData() {
        if (!user?.role || user?.role === UserRole.ADMIN) return;
        const data = await getAllRequests(user?.role);
        setRequestsData(data);
    }

    useEffect(() => {
        fetchData();
    }, [user?.role]);

    const stats = [
        { title: 'Total Requests', value: requestsData?.total, color: 'text-foreground' },
        { title: 'Approved', value: requestsData?.approved, color: 'text-green-600' },
        { title: 'Pending', value: requestsData?.pending, color: 'text-yellow-600' },
        { title: 'Rejected', value: requestsData?.rejected, color: 'text-red-600' },
    ]


    if(user?.role==UserRole.ADMIN) return <AdminDashboard />;

    if (!requestsData) return <DashboardLoading />;

    return (
        <div className="max-w-5xl mx-auto space-y-8">
            {/* Welcome Section */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 animate-fade-in">
                <div>
                    <h1 className="text-2xl font-bold text-foreground">
                        <span role="img" aria-label="truck" className="mr-2">🚚</span>
                        Welcome, {user?.rank} {user?.name}
                    </h1>
                    <p className="text-muted-foreground">MT Office Dashboard</p>
                </div>
            </div>

            {/* Stats */}
            <div className="grid md:grid-cols-4 grid-cols-2 gap-4">
                {
                    stats.map((stat) => (
                        <Card key={stat.title}>
                            <CardHeader>
                                <CardTitle>{stat.title}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <span className={`text-2xl font-bold ${stat.color}`}>{stat.value}</span>
                            </CardContent>
                        </Card>
                    ))
                }
            </div>
        </div>
    );
}
