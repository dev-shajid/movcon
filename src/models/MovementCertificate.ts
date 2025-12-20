import mongoose, { Schema, Document, models, model } from 'mongoose';

export interface IMovementCertificate extends Document {
    requestId: string;
    certificateNumber: string;
    issuedAt: string;
    validFrom: string;
    validTo: string;
    vehicleDetails: {
        number: string;
        type: string;
        driver: string;
    };
    routeDetails: {
        from: string;
        to: string;
        via?: string;
    };
    authorizedBy: string;
}

const MovementCertificateSchema = new Schema<IMovementCertificate>({
    requestId: { type: String, required: true },
    certificateNumber: { type: String, required: true },
    issuedAt: { type: String, required: true },
    validFrom: { type: String, required: true },
    validTo: { type: String, required: true },
    vehicleDetails: {
        number: { type: String, required: true },
        type: { type: String, required: true },
        driver: { type: String, required: true },
    },
    routeDetails: {
        from: { type: String, required: true },
        to: { type: String, required: true },
        via: { type: String },
    },
    authorizedBy: { type: String, required: true },
}, { timestamps: true });

export default models.MovementCertificate || model<IMovementCertificate>('MovementCertificate', MovementCertificateSchema);
