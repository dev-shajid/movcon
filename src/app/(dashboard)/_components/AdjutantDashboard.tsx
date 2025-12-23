
"use client";

import { useEffect, useState } from "react";
import { useUserStore } from "@/hooks/use-user-store";
import { StatsCard } from "@/components/stats-card";
import { RequestCard } from "@/components/request-card";
import { FileText, Clock, CheckCircle, Shield, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function AdjutantDashboard() {
    const { user } = useUserStore();
    const router = useRouter();
    const [allRequests, setAllRequests] = useState<any[]>([]);
    const [pendingForMe, setPendingForMe] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        // TODO: Fetch all requests and pending for me here, then setAllRequests, setPendingForMe, setLoading(false)
        // This is a placeholder for actual data fetching logic
        setTimeout(() => {
            setAllRequests([]);
            setPendingForMe([]);
            setLoading(false);
        }, 500);
    }, []);

    // Compose rank + name for welcome
    const rank = user?.rank ? user.rank + " " : "";
    const name = user?.name ? user.name.split(" ").pop() : "Adjutant";

    // Stats calculations
    const totalRequests = allRequests.length;
    const pendingRequests = allRequests.filter((r: any) => r.status === "pending");
    const approvedRequests = allRequests.filter((r: any) => r.status === "approved");
    const recentRequests = allRequests.slice(0, 3);

    return (
        <div className="max-w-3xl mx-auto py-10 space-y-8">
            {/* Welcome Section */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 animate-fade-in">
                <div>
                    <h1 className="text-2xl font-bold text-foreground">
                        <span role="img" aria-label="adjutant" className="mr-2">📝</span>
                        Welcome, {rank}{name}
                    </h1>
                    <p className="text-muted-foreground mb-6">Here is a quick overview of your dashboard and pending tasks.</p>
                </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <Card className="shadow-md">
                    <CardHeader>
                        <CardTitle>Pending Requests</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {loading ? (
                            <div className="h-10 w-24 bg-muted rounded animate-pulse" />
                        ) : (
                            <span className="text-3xl font-bold text-yellow-600">{pendingRequests.length}</span>
                        )}
                        <div className="text-muted-foreground mt-2">Requests awaiting your review</div>
                    </CardContent>
                </Card>
                <Card className="shadow-md">
                    <CardHeader>
                        <CardTitle>Profile</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-1">
                            <div><span className="font-semibold">Name:</span> {user?.name || "-"}</div>
                            <div><span className="font-semibold">Role:</span> {user?.role || "-"}</div>
                            <div><span className="font-semibold">Email:</span> {user?.email || "-"}</div>
                        </div>
                    </CardContent>
                </Card>
            </div>
            {/* Stats Grid */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <StatsCard
                    title="Total Requests"
                    value={loading ? "..." : totalRequests}
                    icon={<FileText className="h-5 w-5 text-primary" />}
                    description="All time requests"
                />
                <StatsCard
                    title="Pending"
                    value={loading ? "..." : pendingRequests.length}
                    icon={<Clock className="h-5 w-5 text-warning" />}
                    description="Awaiting approval"
                />
                <StatsCard
                    title="Approved"
                    value={loading ? "..." : approvedRequests.length}
                    icon={<CheckCircle className="h-5 w-5 text-success" />}
                    description="Fully approved"
                />
                <StatsCard
                    title="Your Pending"
                    value={loading ? "..." : pendingForMe.length}
                    icon={<Shield className="h-5 w-5 text-info" />}
                    description="Awaiting your action"
                />
            </div>
            {/* Recent Activity */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-foreground">Recent Activity</h2>
                    <Button variant="ghost" onClick={() => router.push("/requests")} className="group">
                        View All
                        <ArrowUpRight className="h-4 w-4 ml-1 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </Button>
                </div>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {loading
                        ? Array.from({ length: 3 }).map((_, i) => (
                            <div key={i} className="h-40 bg-muted rounded animate-pulse" />
                        ))
                        : recentRequests.map((request: any) => (
                            <RequestCard key={request._id} request={request} />
                        ))}
                </div>
                {!loading && recentRequests.length === 0 && (
                    <div className="text-center py-12 bg-muted/50 rounded-lg">
                        <FileText className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
                        <p className="text-muted-foreground">No requests found</p>
                    </div>
                )}
            </div>
        </div>
    );
}
