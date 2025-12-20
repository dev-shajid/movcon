import mongoose, { Schema, Document, models, model } from 'mongoose';
import { TUserRole, RequestStatus } from '@/types';

export interface IApprovalRecord {
    role: TUserRole;
    userId: string;
    userName: string;
    action: 'approved' | 'rejected';
    timestamp: string;
    remarks?: string;
}

export interface IMovementRequest extends Document {
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
    approvalHistory: IApprovalRecord[];
}

const ApprovalRecordSchema = new Schema<IApprovalRecord>({
    role: { type: String, required: true },
    userId: { type: String, required: true },
    userName: { type: String, required: true },
    action: { type: String, enum: ['approved', 'rejected'], required: true },
    timestamp: { type: String, required: true },
    remarks: { type: String },
}, { _id: false });

const MovementRequestSchema = new Schema<IMovementRequest>({
    requestNumber: { type: String, required: true },
    vehicleNumber: { type: String, required: true },
    vehicleType: { type: String, required: true },
    driverName: { type: String, required: true },
    driverContact: { type: String, required: true },
    purpose: { type: String, required: true },
    route: { type: String, required: true },
    destination: { type: String, required: true },
    departureDate: { type: String, required: true },
    departureTime: { type: String, required: true },
    expectedReturnDate: { type: String, required: true },
    expectedReturnTime: { type: String, required: true },
    status: { type: String, required: true },
    createdAt: { type: String, required: true },
    createdBy: { type: String, required: true },
    approvalHistory: { type: [ApprovalRecordSchema], default: [] },
}, { timestamps: true });

export default models.MovementRequest || model<IMovementRequest>('MovementRequest', MovementRequestSchema);
