'use client'

import { useEffect, useState } from 'react';
import { getAllCertificates } from '@/services/certificate.service';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    FileCheck,
    Download,
    Truck,
    MapPin,
    Calendar,
    Shield,
    Printer
} from 'lucide-react';
import { formatDate } from '@/lib/utils';
import { IMovementCertificate } from '@/models/MovementCertificate';
import CertificateLoading from '@/components/skeleton/certificate-loading';
import CertificateDesign from '@/components/certificate-design';
import { useRef } from 'react';
import { useReactToPrint } from 'react-to-print';

export default function CertificatesPage() {
    const [certificates, setCertificates] = useState<IMovementCertificate[]>([]);
    const [loading, setLoading] = useState(true);

    async function fetchCertificates() {
        setLoading(true);
        const certs = await getAllCertificates();
        setCertificates(certs);
        setLoading(false);
    }

    useEffect(() => {
        fetchCertificates();
    }, []);

    // For print, track which certificate is being printed
    const [activeCert, setActiveCert] = useState<IMovementCertificate | null>(null);
    const printRef = useRef<HTMLDivElement>(null);

    // Print handler (use contentRef instead of content)
    const handlePrint = useReactToPrint({
        contentRef: printRef,
        documentTitle: activeCert ? `Certificate-${activeCert.certificateNumber}` : 'Certificate',
        pageStyle: `@media print { body { background: white !important; } }`,
    });

    // Print handler wrapper
    const handlePrintClick = (cert: IMovementCertificate) => {
        setActiveCert(cert);
        setTimeout(() => {
            handlePrint && handlePrint();
            setActiveCert(null);
        }, 100);
    };

    return (
        <div className="space-y-6">
            <div className="animate-fade-in">
                <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
                    <FileCheck className="h-6 w-6" />
                    Movement Certificates
                </h1>
                <p className="text-muted-foreground">
                    View and download approved movement permission certificates
                </p>
            </div>
            {/* Hidden certificate for print/download */}
            <div style={{ position: 'absolute', left: '-9999px', top: 0 }} aria-hidden="true">
                {activeCert && <div ref={printRef}><CertificateDesign cert={activeCert} /></div>}
            </div>
            {loading ? (
                <div className='grid gap-6 md:grid-cols-2'>
                    <CertificateLoading />
                    <CertificateLoading />
                </div>
            ) : certificates.length > 0 ? (
                <div className="grid gap-6 md:grid-cols-2">
                    {certificates.map((cert: any, index: number) => (
                        <Card
                            key={cert._id}
                            className="card-hover animate-fade-in overflow-hidden p-0"
                            style={{ animationDelay: `${index * 100}ms` }}
                        >
                            {/* Certificate Header */}
                            <div className="bg-primary p-4 text-primary-foreground">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <Shield className="h-8 w-8" />
                                        <div>
                                            <p className="text-xs opacity-80">Movement Permission Certificate</p>
                                            <p className="font-bold text-lg">{cert.certificateNumber}</p>
                                        </div>
                                    </div>
                                    <Badge className="bg-primary-foreground text-primary">
                                        APPROVED
                                    </Badge>
                                </div>
                            </div>

                            <CardContent className="p-4 space-y-4">
                                {/* Vehicle Details */}
                                <div className="flex items-start gap-3">
                                    <Truck className="h-5 w-5 text-muted-foreground mt-0.5" />
                                    <div className="flex-1">
                                        <p className="text-sm text-muted-foreground">Vehicle</p>
                                        <p className="font-semibold">{cert.vehicleDetails.number}</p>
                                        <p className="text-sm text-muted-foreground">
                                            {cert.vehicleDetails.type} • Driver: {cert.vehicleDetails.driver}
                                        </p>
                                    </div>
                                </div>

                                {/* Route Details */}
                                <div className="flex items-start gap-3">
                                    <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                                    <div className="flex-1">
                                        <p className="text-sm text-muted-foreground">Route</p>
                                        <p className="font-semibold">
                                            {cert.routeDetails.from} → {cert.routeDetails.to}
                                        </p>
                                        {cert.routeDetails.via && (
                                            <p className="text-sm text-muted-foreground">
                                                Via: {cert.routeDetails.via}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                {/* Validity */}
                                <div className="flex items-start gap-3">
                                    <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                                    <div className="flex-1">
                                        <p className="text-sm text-muted-foreground">Valid Period</p>
                                        <p className="font-semibold">
                                            {formatDate(new Date(cert.validFrom))} - {formatDate(new Date(cert.validTo))}
                                        </p>
                                    </div>
                                </div>

                                {/* Authorization */}
                                <div className="pt-3 border-t">
                                    <p className="text-sm text-muted-foreground">Authorized By</p>
                                    <p className="font-semibold">{cert.authorizedBy}</p>
                                    <p className="text-xs text-muted-foreground">
                                        Issued: {formatDate(new Date(cert.issuedAt))}
                                    </p>
                                </div>

                                {/* Actions */}
                                <div className="flex gap-2 pt-2">
                                    <Button variant="outline" className="flex-1" onClick={() => handlePrintClick(cert)}>
                                        <Printer className="h-4 w-4 mr-2" />
                                        Print
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            ) : (
                <Card className="animate-fade-in">
                    <CardContent className="py-12 text-center">
                        <FileCheck className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
                        <p className="text-lg font-medium text-foreground">No Certificates Yet</p>
                        <p className="text-muted-foreground">
                            Certificates will appear here once requests are fully approved
                        </p>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}