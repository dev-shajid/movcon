'use client'

import { useUserStore } from '@/hooks/use-user-store';
import AdminDashboard from './components/AdminDashboard';
import MtOfficeDashboard from './components/MtOfficeDashboard';
import AdjutantDashboard from './components/AdjutantDashboard';
import CODashboard from './components/CODashboard';
import GSO1Dashboard from './components/GSO1Dashboard';
import ColStaffDashboard from './components/ColStaffDashboard';
import MPCheckpostDashboard from './components/MPCheckpostDashboard';

export default function Dashboard() {
  const { user } = useUserStore();

  if (!user) return <div>Loading...</div>;

  switch (user.role) {
    case 'admin':
      return <AdminDashboard />;
    case 'mt_office':
      return <MtOfficeDashboard />;
    case 'adjutant':
      return <AdjutantDashboard />;
    case 'co':
      return <CODashboard />;
    case 'gso1':
      return <GSO1Dashboard />;
    case 'col_staff':
      return <ColStaffDashboard />;
    case 'mp_checkpost':
      return <MPCheckpostDashboard />;
    default:
      return <div>Unknown role</div>;
  }
}
