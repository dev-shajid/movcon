// src/services/certificate.service.ts
'use server'
import { connectToDatabase } from '@/lib/mongodb';
import MovementCertificate from '@/models/MovementCertificate';

export async function getAllCertificates() {
    await connectToDatabase();
    return MovementCertificate.find({}).lean();
}

export async function createCertificate(data: any) {
    await connectToDatabase();
    return MovementCertificate.create(data);
}
