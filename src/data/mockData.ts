import { User, MovementRequest, CheckpostLog, MovementCertificate, TUserRole } from '@/types';

export const mockUsers: User[] = [
  { id: '1', name: 'Capt. Ahmed Khan', role: 'mt_office', email: 'ahmed.khan@army.mil', verified: true },
  { id: '2', name: 'Maj. Hassan Ali', role: 'adjutant', email: 'hassan.ali@army.mil', verified: true },
  { id: '3', name: 'Lt. Col. Imran Malik', role: 'co', email: 'imran.malik@army.mil', verified: true },
  { id: '4', name: 'Col. Tariq Mahmood', role: 'gso1', email: 'tariq.mahmood@army.mil', verified: true },
  { id: '5', name: 'Brig. Aslam Shah', role: 'col_staff', email: 'aslam.shah@army.mil', verified: true },
  { id: '6', name: 'Havaldar Rashid', role: 'mp_checkpost', email: 'rashid@army.mil', verified: true },
];

export const mockRequests: MovementRequest[] = [
  {
    id: 'REQ-001',
    requestNumber: 'MR-2024-001',
    vehicleNumber: 'ARMY-4521',
    vehicleType: 'Toyota Land Cruiser',
    driverName: 'Cpl Saleem',
    driverContact: '+92-321-1234567',
    purpose: 'Official duty - Equipment transport to forward base',
    route: 'HQ → Checkpoint Alpha → Forward Base Delta',
    destination: 'Forward Base Delta',
    departureDate: '2024-12-15',
    departureTime: '08:00',
    expectedReturnDate: '2024-12-15',
    expectedReturnTime: '18:00',
    status: 'approved',
    createdAt: '2024-12-10T09:30:00Z',
    createdBy: '1',
    approvalHistory: [
      { role: 'adjutant', userId: '2', userName: 'Maj. Hassan Ali', action: 'approved', timestamp: '2024-12-10T10:00:00Z', remarks: 'Approved for official duty' },
      { role: 'co', userId: '3', userName: 'Lt. Col. Imran Malik', action: 'approved', timestamp: '2024-12-10T11:30:00Z' },
      { role: 'gso1', userId: '4', userName: 'Col. Tariq Mahmood', action: 'approved', timestamp: '2024-12-10T14:00:00Z' },
      { role: 'col_staff', userId: '5', userName: 'Brig. Aslam Shah', action: 'approved', timestamp: '2024-12-10T16:00:00Z', remarks: 'Final approval granted' },
    ],
  },
  {
    id: 'REQ-002',
    requestNumber: 'MR-2024-002',
    vehicleNumber: 'ARMY-7832',
    vehicleType: 'Hilux Double Cabin',
    driverName: 'LCpl Farooq',
    driverContact: '+92-300-9876543',
    purpose: 'Medical evacuation support',
    route: 'Medical Center → District Hospital',
    destination: 'District Hospital',
    departureDate: '2024-12-16',
    departureTime: '06:00',
    expectedReturnDate: '2024-12-16',
    expectedReturnTime: '14:00',
    status: 'pending_co',
    createdAt: '2024-12-11T08:15:00Z',
    createdBy: '1',
    approvalHistory: [
      { role: 'adjutant', userId: '2', userName: 'Maj. Hassan Ali', action: 'approved', timestamp: '2024-12-11T09:00:00Z', remarks: 'Priority medical mission' },
    ],
  },
  {
    id: 'REQ-003',
    requestNumber: 'MR-2024-003',
    vehicleNumber: 'ARMY-2145',
    vehicleType: 'Bedford Truck',
    driverName: 'snk Akram',
    driverContact: '+92-333-4567890',
    purpose: 'Supply convoy - Rations delivery',
    route: 'Supply Depot → Outpost Bravo → Outpost Charlie',
    destination: 'Outpost Charlie',
    departureDate: '2024-12-17',
    departureTime: '05:00',
    expectedReturnDate: '2024-12-18',
    expectedReturnTime: '20:00',
    status: 'pending_adjutant',
    createdAt: '2024-12-12T07:00:00Z',
    createdBy: '1',
    approvalHistory: [],
  },
  {
    id: 'REQ-004',
    requestNumber: 'MR-2024-004',
    vehicleNumber: 'ARMY-9988',
    vehicleType: 'Suzuki Carry',
    driverName: 'Cpl Jameel',
    driverContact: '+92-345-6789012',
    purpose: 'Administrative work - Document delivery',
    route: 'HQ → Corps HQ',
    destination: 'Corps HQ',
    departureDate: '2024-12-14',
    departureTime: '10:00',
    expectedReturnDate: '2024-12-14',
    expectedReturnTime: '16:00',
    status: 'pending_gso1',
    createdAt: '2024-12-09T14:30:00Z',
    createdBy: '1',
    approvalHistory: [
      { role: 'adjutant', userId: '2', userName: 'Maj. Hassan Ali', action: 'approved', timestamp: '2024-12-09T15:00:00Z' },
      { role: 'co', userId: '3', userName: 'Lt. Col. Imran Malik', action: 'approved', timestamp: '2024-12-09T16:00:00Z' },
    ],
  },
  {
    id: 'REQ-005',
    requestNumber: 'MR-2024-005',
    vehicleNumber: 'ARMY-5566',
    vehicleType: 'Toyota Corolla',
    driverName: 'LCpl Waseem',
    driverContact: '+92-312-3456789',
    purpose: 'VIP escort duty',
    route: 'Airport → Guest House → HQ',
    destination: 'HQ Guest House',
    departureDate: '2024-12-18',
    departureTime: '14:00',
    expectedReturnDate: '2024-12-18',
    expectedReturnTime: '22:00',
    status: 'pending_col_staff',
    createdAt: '2024-12-08T11:00:00Z',
    createdBy: '1',
    approvalHistory: [
      { role: 'adjutant', userId: '2', userName: 'Maj. Hassan Ali', action: 'approved', timestamp: '2024-12-08T12:00:00Z' },
      { role: 'co', userId: '3', userName: 'Lt. Col. Imran Malik', action: 'approved', timestamp: '2024-12-08T13:30:00Z' },
      { role: 'gso1', userId: '4', userName: 'Col. Tariq Mahmood', action: 'approved', timestamp: '2024-12-08T15:00:00Z', remarks: 'High priority VIP movement' },
    ],
  },
];

export const mockCheckpostLogs: CheckpostLog[] = [
  {
    id: 'LOG-001',
    requestId: 'REQ-001',
    vehicleNumber: 'ARMY-4521',
    outTime: '2024-12-15T08:15:00Z',
    inTime: '2024-12-15T17:45:00Z',
    loggedBy: '6',
    date: '2024-12-15',
  },
  {
    id: 'LOG-002',
    requestId: 'REQ-001',
    vehicleNumber: 'ARMY-4521',
    outTime: '2024-12-14T09:00:00Z',
    inTime: '2024-12-14T16:30:00Z',
    loggedBy: '6',
    date: '2024-12-14',
  },
];

export const mockCertificates: MovementCertificate[] = [
  {
    id: 'CERT-001',
    requestId: 'REQ-001',
    certificateNumber: 'MPC-2024-001',
    issuedAt: '2024-12-10T16:00:00Z',
    validFrom: '2024-12-15T00:00:00Z',
    validTo: '2024-12-15T23:59:59Z',
    vehicleDetails: {
      number: 'ARMY-4521',
      type: 'Toyota Land Cruiser',
      driver: 'Cpl Saleem',
    },
    routeDetails: {
      from: 'HQ',
      to: 'Forward Base Delta',
      via: 'Checkpoint Alpha',
    },
    authorizedBy: 'Brig. Aslam Shah',
  },
];

export const getUserByRole = (role: TUserRole): User | undefined => {
  return mockUsers.find(user => user.role === role);
};

export const getRequestsForRole = (role: TUserRole): MovementRequest[] => {
  switch (role) {
    case 'mt_office':
      return mockRequests;
    case 'adjutant':
      return mockRequests.filter(r => r.status === 'pending_adjutant' || r.approvalHistory.some(h => h.role === 'adjutant'));
    case 'co':
      return mockRequests.filter(r => r.status === 'pending_co' || r.approvalHistory.some(h => h.role === 'co'));
    case 'gso1':
      return mockRequests.filter(r => r.status === 'pending_gso1' || r.approvalHistory.some(h => h.role === 'gso1'));
    case 'col_staff':
      return mockRequests.filter(r => r.status === 'pending_col_staff' || r.status === 'approved' || r.approvalHistory.some(h => h.role === 'col_staff'));
    case 'mp_checkpost':
      return mockRequests.filter(r => r.status === 'approved');
    default:
      return [];
  }
};

export const getPendingCountForRole = (role: TUserRole): number => {
  switch (role) {
    case 'adjutant':
      return mockRequests.filter(r => r.status === 'pending_adjutant').length;
    case 'co':
      return mockRequests.filter(r => r.status === 'pending_co').length;
    case 'gso1':
      return mockRequests.filter(r => r.status === 'pending_gso1').length;
    case 'col_staff':
      return mockRequests.filter(r => r.status === 'pending_col_staff').length;
    default:
      return 0;
  }
};
