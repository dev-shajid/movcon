// src/services/checkpost-log.service.ts
'use server'
import { connectToDatabase } from '@/lib/mongodb';
import CheckpostLog from '@/models/CheckpostLog';

export async function getAllCheckpostLogs() {
    await connectToDatabase();
    return CheckpostLog.find({}).lean();
}

export async function createCheckpostLog(data: any) {
    await connectToDatabase();
    return CheckpostLog.create(data);
}
