// src/services/certificate.service.ts
'use server'
import { connectToDatabase } from '@/lib/mongodb';
import MovementCertificate from '@/models/MovementCertificate';
import { cacheTag } from 'next/cache';

export async function getCertificateByRequestId(requestId: string) {
    await connectToDatabase();
    const certificate = await MovementCertificate.findOne({ requestId }).lean();
    return certificate ? { ...certificate, _id: certificate._id.toString() } : null;
}

export async function getAllCertificates() {
    'use cache';
    cacheTag('all_certificates');

    await connectToDatabase();
    const certificates = await MovementCertificate.find({}).lean();
    return certificates.map(cert => ({
        ...cert,
        _id: cert._id.toString(),
    }));
}

export async function createCertificate(data: any) {
    await connectToDatabase();
    await MovementCertificate.create(data);
    return true
}
