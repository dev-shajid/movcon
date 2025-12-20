import mongoose, { Schema, Document, models, model } from 'mongoose';
import { TUserRole } from '@/types';

export interface IUser extends Document {
    name: string;
    email: string;
    role: TUserRole;
    verified?: boolean;
}

const UserSchema = new Schema<IUser>({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    role: {
        type: String, enum: [
            'admin', 'mt_office', 'adjutant', 'co', 'gso1', 'col_staff', 'mp_checkpost'
        ], required: true
    },
    verified: { type: Boolean, default: false },
}, { timestamps: true });

export default models.User || model<IUser>('User', UserSchema);
