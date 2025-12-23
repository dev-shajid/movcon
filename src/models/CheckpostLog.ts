import { Schema, Document, models, model } from 'mongoose';

export interface ICheckpostLog extends Document {
    requestId: Schema.Types.ObjectId;
    vehicleNumber: string;
    outTime?: string;
    inTime?: string;
    loggedBy: string;
    date: string;
}

const CheckpostLogSchema = new Schema<ICheckpostLog>({
    requestId: { 
        type: Schema.Types.ObjectId, 
        ref: 'MovementRequest',
        required: false
    },
    vehicleNumber: { type: String, required: true },
    outTime: { type: String },
    inTime: { type: String },
    loggedBy: { type: String, required: true },
    date: { type: String, required: true },
}, { timestamps: true });

export default models.CheckpostLog || model<ICheckpostLog>('CheckpostLog', CheckpostLogSchema);