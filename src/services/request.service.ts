// src/services/request.service.ts
'use server'
import { connectToDatabase } from '@/lib/mongodb';
import MovementRequest from '@/models/MovementRequest';

export async function getAllRequests() {
    await connectToDatabase();
    return MovementRequest.find({}).lean();
}

export async function createRequest(data: any) {
    await connectToDatabase();
    return MovementRequest.create(data);
}
