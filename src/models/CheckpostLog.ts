import mongoose, { Schema, Document, models, model } from 'mongoose';

export interface ICheckpostLog extends Document {
    requestId: string;
    vehicleNumber: string;
    outTime?: string;
    inTime?: string;
    loggedBy: string;
    date: string;
}

const CheckpostLogSchema = new Schema<ICheckpostLog>({
    requestId: { type: String, required: true },
    vehicleNumber: { type: String, required: true },
    outTime: { type: String },
    inTime: { type: String },
    loggedBy: { type: String, required: true },
    date: { type: String, required: true },
}, { timestamps: true });

export default models.CheckpostLog || model<ICheckpostLog>('CheckpostLog', CheckpostLogSchema);
