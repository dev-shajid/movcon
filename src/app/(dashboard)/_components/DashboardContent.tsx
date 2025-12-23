'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useUserStore } from "@/hooks/use-user-store";
import { IMovementRequest } from "@/models/MovementRequest";
import { getAllRequests } from "@/services/request.service";
import { useEffect, useState } from "react";
import { StatsCardsLoading, GreetingCardLoading } from "@/components/skeleton/dashboard-loading";
import { UserRole } from "@/lib/UserRole";
import AdminDashboard from "./AdminDashboard";
import { UserProfile } from "@/services/auth.service";

export default function DashboardContent() {
    const { user } = useUserStore();

    return (
        <div className="max-w-5xl mx-auto space-y-8">
            {/* Welcome Section */}
            <GreetingCard user={user} />

            {
                user?.role === UserRole.ADMIN
                    ? <AdminDashboard />
                    : user?.role === UserRole.MP_CHECKPOST
                        ? null
                        : <StatsCard />
            }


        </div>
    );
}


function GreetingCard({ user }: { user: UserProfile | null }) {
    if (!user) return <GreetingCardLoading />;
    return (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 animate-fade-in">
            <div>
                <h1 className="text-2xl font-bold text-foreground">
                    <span role="img" aria-label="truck" className="mr-2">🚚</span>
                    Welcome, {user.rank} {user.name}
                </h1>
                <p className="text-muted-foreground">{user.role.split('_').join(' ').toLocaleUpperCase()} Dashboard</p>
            </div>
        </div>
    );
}

function StatsCard() {
    const { user, pendingRequests } = useUserStore();

    const [requestsData, setRequestsData] = useState<{
        requests: IMovementRequest[];
        total: number;
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
        { title: 'Pending', value: pendingRequests.length, color: 'text-yellow-600' },
        { title: 'Rejected', value: requestsData?.rejected, color: 'text-red-600' },
    ]
    if (!requestsData) return <StatsCardsLoading />;
    return <div className="grid md:grid-cols-4 grid-cols-2 gap-4" >
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
}