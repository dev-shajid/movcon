// src/services/request.service.ts
'use server'

import { connectToDatabase } from '@/lib/mongodb';
import { getAllCheckpostLogs } from './checkpost-log.service';
import MovementRequest, { IMovementRequest } from '@/models/MovementRequest';// Get all requests pending approval for a given role

// Types for request and response data
export interface IUser {
    id: string;
    name: string;
    role: string;
}

export interface IApprovalHistory {
    role: string;
    userId: string;
    userName: string;
    action: 'approved' | 'rejected';
    timestamp: string;
    remarks?: string;
}

export interface ICreateRequestData {
    // Add all required fields for creating a request
    [key: string]: any;
}

export interface IApproveRequestParams {
    requestId: string;
    user: IUser;
}

export interface IRejectRequestParams {
    requestId: string;
    user: IUser;
    remarks?: string;
}

export interface IGetAllRequestsResponse {
    requests: IMovementRequest[];
    total: number;
    pending: number;
    approved: number;
    rejected: number;
}

export interface ICheckpostRequest extends IMovementRequest {
    vehicleIn: boolean;
}

import { cacheTag, revalidateTag } from 'next/cache';
import { UserRole } from '@/lib/UserRole';
import CheckpostLog from '@/models/CheckpostLog';
import MovementCertificate from '@/models/MovementCertificate';


export async function getRequestedMovementsForRole(role: string): Promise<IMovementRequest[]> {
    'use cache';
    cacheTag(`requests_for_role_${role}`);

    await connectToDatabase();
    let status = '';
    switch (role) {
        case 'adjutant':
            status = 'pending_adjutant'; break;
        case 'co':
            status = 'pending_co'; break;
        case 'gso1':
            status = 'pending_gso1'; break;
        case 'col_staff':
            status = 'pending_col_staff'; break;
        default:
            return [];
    }
    const docs = await MovementRequest.find({ status }).lean();
    return toPlain(docs);
}

// Approval chain order (global, enforced for all requests)
const APPROVAL_CHAIN = ['adjutant', 'co', 'gso1', 'col_staff'];
const STATUS_CHAIN = ['pending_adjutant', 'pending_co', 'pending_gso1', 'pending_col_staff'];

function getNextStatus(currentStatus: string) {
    const idx = STATUS_CHAIN.indexOf(currentStatus);
    if (idx >= 0 && idx < STATUS_CHAIN.length - 1) {
        return STATUS_CHAIN[idx + 1];
    }
    return 'approved';
}

export async function approveRequest({ requestId, user }: IApproveRequestParams): Promise<IMovementRequest> {
    await connectToDatabase();
    const req = await MovementRequest.findById(requestId);
    if (!req) throw new Error('Request not found');

    // Only allow if user is in approval chain and status matches
    const roleIdx = APPROVAL_CHAIN.indexOf(user.role);
    const statusIdx = STATUS_CHAIN.indexOf(req.status);
    if (roleIdx === -1 || roleIdx !== statusIdx) throw new Error('Not authorized to approve at this stage');

    // Check if all lower roles have approved
    for (let i = 0; i < roleIdx; i++) {
        if (!req.approvalHistory.some((h: any) => h.role === APPROVAL_CHAIN[i] && h.action === 'approved')) {
            throw new Error('Lower rank must approve first');
        }
    }

    req.approvalHistory.push({
        role: user.role,
        userId: user.id,
        userName: user.name,
        action: 'approved',
        timestamp: new Date().toISOString(),
    });
    req.status = getNextStatus(req.status);
    await req.save();

    if (req.status === 'approved') {
        // Fallback logic for routeDetails.from and to
        const routeFrom = req.route;
        const routeTo = req.destination;
        if (!routeFrom || !routeTo) {
            throw new Error('Request is missing routeFrom or routeTo fields required for certificate.');
        }
        await MovementCertificate.create({
            requestId: req._id,
            certificateNumber: `CERT-${new Date().getFullYear()}-${String(Math.floor(1000 + Math.random() * 9000))}`,
            issuedAt: new Date().toISOString(),
            validFrom: new Date().toISOString(),
            validTo: new Date(new Date().setDate(new Date().getDate() + 7)).toISOString(), // Valid for 7 days
            vehicleDetails: {
                number: req.vehicleNumber,
                type: req.vehicleType,
                driver: req.driverName,
            },
            routeDetails: {
                from: routeFrom,
                to: routeTo,
                via: req.routeVia,
            },
            authorizedBy: user.name,
        });
        revalidateTag('all_certificates', {});
    }
    revalidateTag(`requests_for_role_${user.role}`, {});
    return toPlain(req.toObject());
}

export async function rejectRequest({ requestId, user, remarks }: IRejectRequestParams): Promise<IMovementRequest> {
    await connectToDatabase();
    const req = await MovementRequest.findById(requestId);
    if (!req) throw new Error('Request not found');

    // Only allow if user is in approval chain and status matches
    const roleIdx = APPROVAL_CHAIN.indexOf(user.role);
    const statusIdx = STATUS_CHAIN.indexOf(req.status);
    if (roleIdx === -1 || roleIdx !== statusIdx) throw new Error('Not authorized to reject at this stage');

    // Check if all lower roles have approved
    for (let i = 0; i < roleIdx; i++) {
        if (!req.approvalHistory.some((h: any) => h.role === APPROVAL_CHAIN[i] && h.action === 'approved')) {
            throw new Error('Lower rank must approve first');
        }
    }

    req.approvalHistory.push({
        role: user.role,
        userId: user.id,
        userName: user.name,
        action: 'rejected',
        timestamp: new Date().toISOString(),
        remarks,
    });
    req.status = 'rejected';
    await req.save();
    revalidateTag(`requests_for_role_${user.role}`, {});
    return toPlain(req.toObject());
}

export async function getRequestById(id: string): Promise<IMovementRequest | null> {
    await connectToDatabase();
    const doc = await MovementRequest.findById(id).lean();
    if (!doc) return null;
    return toPlain(doc);
}

// Utility to deeply convert Mongoose documents to plain objects with string _id
function toPlain(obj: any): any {
    if (Array.isArray(obj)) return obj.map(toPlain);
    if (obj && typeof obj === 'object') {
        const plain: any = {};
        for (const key in obj) {
            if (key === '__v') continue;
            if (key === '_id') {
                plain._id = obj._id?.toString?.();
            } else {
                plain[key] = toPlain(obj[key]);
            }
        }
        return plain;
    }
    return obj;
}

export async function getAllRequests(role: string | null = null): Promise<IGetAllRequestsResponse> {
    await connectToDatabase();

    if (!role) throw new Error('User not authenticated');

    const query = role === UserRole.MT_OFFICE ? {} : {
        approvalHistory: {
            $elemMatch: { role: role },
        },
    };

    const docs = await MovementRequest.find(query).lean();
    const plainDocs = toPlain(docs)

    return {
        requests: plainDocs,
        total: plainDocs.length,
        pending: plainDocs.filter((r: any) => r.status.startsWith('pending_')).length,
        approved: plainDocs.filter((r: any) => r.status === 'approved').length,
        rejected: plainDocs.filter((r: any) => r.status === 'rejected').length,
    }
}


export async function getCheckpostRequests(role: string | null = null): Promise<ICheckpostRequest[]> {
    'use cache';
    cacheTag(`checkpost_requests`);

    await connectToDatabase();
    if (role != UserRole.MP_CHECKPOST) throw new Error('User not authenticated');

    const docs = await MovementRequest.find({ status: 'approved' }).lean();
    const plainDocs = toPlain(docs);

    for (let r of plainDocs) {
        const log = await CheckpostLog.findOne({ requestId: r._id, outTime: { $exists: true }, inTime: { $exists: false } }).sort({ timestamp: -1 }).lean();
        if (log) {
            r.vehicleIn = false;
        } else {
            r.vehicleIn = true;
        }
    }

    return plainDocs
}



export async function createRequest(data: ICreateRequestData): Promise<IMovementRequest | IMovementRequest[]> {
    await connectToDatabase();

    // Generate a unique request number (e.g., MR-YYYY-XXX)
    const year = new Date().getFullYear();
    const count = await MovementRequest.countDocuments({}) + 1;
    const requestNumber = `MR-${year}-${String(count).padStart(3, '0')}`;

    // Set default status and timestamps
    const now = new Date();
    const movementRequest = {
        ...data,
        requestNumber,
        status: 'pending_adjutant',
        createdAt: now.toISOString(),
        approvalHistory: [],
    };

    const doc = await MovementRequest.create(movementRequest);
    if (Array.isArray(doc)) {
        return toPlain(doc.map((d) => d.toObject()));
    }
    return doc
}
