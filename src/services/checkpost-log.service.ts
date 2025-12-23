'use server'

import { connectToDatabase } from '@/lib/mongodb';
import CheckpostLog, { ICheckpostLog } from '@/models/CheckpostLog';
import MovementRequest from '@/models/MovementRequest';
import mongoose from 'mongoose';
import { revalidateTag } from 'next/cache';

export interface IRequestIdPopulated {
    _id: string;
    vehicleNumber: string;
    requestNumber: string;
    destination: string;
}

export interface ICheckpostLogPopulated extends Omit<ICheckpostLog, 'requestId' | '_id' | 'createdAt' | 'updatedAt'> {
    _id: string;
    requestId: IRequestIdPopulated;
    createdAt?: string;
    updatedAt?: string;
}

export async function getAllCheckpostLogs(): Promise<ICheckpostLogPopulated[]> {
    await connectToDatabase();
    const logs = await CheckpostLog
        .find({})
        .populate({ path: 'requestId', model: MovementRequest, select: 'vehicleNumber requestNumber destination' })
        .lean();

    return logs.map((log) => ({
        ...log,
        requestId: {
            ...log.requestId,
            _id: log.requestId?._id.toString(),
        },
        _id: log._id.toString(),
        createdAt: log.createdAt?.toISOString(),
        updatedAt: log.updatedAt?.toISOString(),
    }));
}

export async function createCheckpostLog(data: Partial<ICheckpostLog>) {
    await connectToDatabase();
    const existingOutLog = await CheckpostLog.findOne({
        requestId: data.requestId,
        date: data.date,
        outTime: { $exists: true },
        inTime: { $exists: false }
    });

    if (existingOutLog) {
        throw new Error('OUT time already logged for this request today.');
    }
    await CheckpostLog.create({ ...data, requestId: data.requestId, });
    revalidateTag('checkpost_requests', {});
}

export async function updateCheckpostLog(requestId: mongoose.Types.ObjectId, date: string) {
    await connectToDatabase();
    await CheckpostLog.findOneAndUpdate(
        { requestId, date, outTime: { $exists: true }, inTime: { $exists: false } },
        { $set: { inTime: new Date().toISOString() } }, { new: true }
    );
    revalidateTag('checkpost_requests', {});

    return true
}