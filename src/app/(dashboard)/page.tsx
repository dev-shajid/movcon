'use client'

import { StatsCard } from '@/components/stats-card';
import { RequestCard } from '@/components/request-card';
import { 
  FileText, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Truck, 
  ArrowUpRight,
  Shield
} from 'lucide-react';
import { mockRequests, getRequestsForRole, getPendingCountForRole } from '@/data/mockData';
import { ROLE_LABELS } from '@/types';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/auth.context';
import { useRouter } from 'next/navigation';

export default function Dashboard() {
  const { user } = useAuth();
  const router = useRouter();

  if (!user) return null;

  const userRequests = getRequestsForRole(user.role);
  const pendingCount = getPendingCountForRole(user.role);
  const totalRequests = mockRequests.length;
  const approvedRequests = mockRequests.filter(r => r.status === 'approved').length;
  const pendingRequests = mockRequests.filter(r => r.status !== 'approved' && r.status !== 'rejected').length;

  const recentRequests = userRequests.slice(0, 3);

  return (
      <div className="space-y-8">
        {/* Welcome Section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="animate-fade-in">
            <h1 className="text-2xl font-bold text-foreground">
              Welcome back, {user.name.split(' ').pop()}
            </h1>
            <p className="text-muted-foreground">
              {ROLE_LABELS[user.role]} Dashboard
            </p>
          </div>
          {user.role === 'mt_office' && (
            <Button onClick={() => router.push('/requests/new')} className="animate-fade-in">
              <FileText className="h-4 w-4 mr-2" />
              New Request
            </Button>
          )}
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            title="Total Requests"
            value={totalRequests}
            icon={<FileText className="h-5 w-5 text-primary" />}
            description="All time requests"
          />
          <StatsCard
            title="Pending"
            value={pendingRequests}
            icon={<Clock className="h-5 w-5 text-warning" />}
            description="Awaiting approval"
          />
          <StatsCard
            title="Approved"
            value={approvedRequests}
            icon={<CheckCircle className="h-5 w-5 text-success" />}
            description="Fully approved"
          />
          {user.role !== 'mt_office' && user.role !== 'mp_checkpost' && (
            <StatsCard
              title="Your Pending"
              value={pendingCount}
              icon={<Shield className="h-5 w-5 text-info" />}
              description="Awaiting your action"
            />
          )}
          {(user.role === 'mt_office' || user.role === 'mp_checkpost') && (
            <StatsCard
              title="Active Vehicles"
              value={approvedRequests}
              icon={<Truck className="h-5 w-5 text-info" />}
              description="Currently permitted"
            />
          )}
        </div>

        {/* Recent Activity */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-foreground">Recent Activity</h2>
            <Button variant="ghost" onClick={() => router.push('/requests')} className="group">
              View All
              <ArrowUpRight className="h-4 w-4 ml-1 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Button>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {recentRequests.map((request) => (
              <RequestCard key={request.id} request={request} />
            ))}
          </div>
          {recentRequests.length === 0 && (
            <div className="text-center py-12 bg-muted/50 rounded-lg">
              <FileText className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
              <p className="text-muted-foreground">No requests found</p>
            </div>
          )}
        </div>
      </div>
  );
}
