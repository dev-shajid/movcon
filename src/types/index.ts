export type UserRole = 
  | 'mt_office' 
  | 'adjutant' 
  | 'co' 
  | 'gso1' 
  | 'col_staff' 
  | 'mp_checkpost';

export type RequestStatus = 
  | 'pending_adjutant'
  | 'pending_co'
  | 'pending_gso1'
  | 'pending_col_staff'
  | 'approved'
  | 'rejected';

export interface User {
  id: string;
  name: string;
  role: UserRole;
  email: string;
}

export interface MovementRequest {
  id: string;
  requestNumber: string;
  vehicleNumber: string;
  vehicleType: string;
  driverName: string;
  driverContact: string;
  purpose: string;
  route: string;
  destination: string;
  departureDate: string;
  departureTime: string;
  expectedReturnDate: string;
  expectedReturnTime: string;
  status: RequestStatus;
  createdAt: string;
  createdBy: string;
  approvalHistory: ApprovalRecord[];
}

export interface ApprovalRecord {
  role: UserRole;
  userId: string;
  userName: string;
  action: 'approved' | 'rejected';
  timestamp: string;
  remarks?: string;
}

export interface CheckpostLog {
  id: string;
  requestId: string;
  vehicleNumber: string;
  outTime?: string;
  inTime?: string;
  loggedBy: string;
  date: string;
}

export interface MovementCertificate {
  id: string;
  requestId: string;
  certificateNumber: string;
  issuedAt: string;
  validFrom: string;
  validTo: string;
  vehicleDetails: {
    number: string;
    type: string;
    driver: string;
  };
  routeDetails: {
    from: string;
    to: string;
    via?: string;
  };
  authorizedBy: string;
}

export const ROLE_LABELS: Record<UserRole, string> = {
  mt_office: 'MT Office',
  adjutant: 'Adjutant',
  co: 'Commanding Officer',
  gso1: 'GSO-1',
  col_staff: 'Col Staff',
  mp_checkpost: 'MP Checkpost',
};

export const STATUS_LABELS: Record<RequestStatus, string> = {
  pending_adjutant: 'Pending at Adjutant',
  pending_co: 'Pending at CO',
  pending_gso1: 'Pending at GSO-1',
  pending_col_staff: 'Pending at Col Staff',
  approved: 'Fully Approved',
  rejected: 'Rejected',
};

export const ROLE_COLORS: Record<UserRole, string> = {
  mt_office: 'bg-info/15 text-info',
  adjutant: 'bg-purple-500/15 text-purple-600',
  co: 'bg-amber-500/15 text-amber-600',
  gso1: 'bg-emerald-500/15 text-emerald-600',
  col_staff: 'bg-primary/15 text-primary',
  mp_checkpost: 'bg-slate-500/15 text-slate-600',
};
