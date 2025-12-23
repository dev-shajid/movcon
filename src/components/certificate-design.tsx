import React, { forwardRef } from 'react';
import { IMovementCertificate } from '@/models/MovementCertificate';
import { formatDate } from '@/lib/utils';

const CertificateDesign = forwardRef<
  HTMLDivElement,
  { cert: IMovementCertificate }
>(({ cert }, ref) => {
  const pageStyle = `
    @page {
      size: A4;
      margin: 0;
    }
    @media print {
      body, html {
        margin: 0;
        padding: 0;
        width: 210mm;
        height: 297mm;
      }
      #cert-container {
        box-shadow: none !important;
        margin: 0 !important;
      }
    }
  `;

  return (
    <div>
      <style>{pageStyle}</style>
      <div
        ref={ref}
        id="cert-container"
        style={{
          width: '210mm',
          height: '297mm',
          margin: '0 auto',
          backgroundColor: '#ffffff',
          color: '#1a1a1a',
          position: 'relative',
          fontFamily: '"Segoe UI", "Helvetica Neue", Arial, sans-serif',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Top Decorative Border */}
        <div
          style={{
            height: '8px',
            background: 'linear-gradient(90deg, #1e3a2a 0%, #2d5a3d 50%, #1e3a2a 100%)',
            width: '100%',
          }}
        />

        {/* Main Content Area */}
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            padding: '32px 40px',
            position: 'relative',
          }}
        >
          {/* Subtle Watermark Background */}
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              fontSize: '140px',
              fontWeight: 'bold',
              color: 'rgba(30, 58, 42, 0.08)',
              whiteSpace: 'nowrap',
              pointerEvents: 'none',
              zIndex: 0,
            }}
          >
            BANGLADESH ARMY
          </div>

          {/* Header Section */}
          <div style={{ position: 'relative', zIndex: 10, marginBottom: '20px' }}>
            {/* Logo and Title Section */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '16px',
                paddingBottom: '16px',
                borderBottom: '2px solid #1e3a2a',
              }}
            >
              {/* Left Logo */}
              <div style={{ width: '70px', height: '70px', flexShrink: 0 }}>
                <img
                  src="/logo.png"
                  alt="Bangladesh Army Logo"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain',
                  }}
                />
              </div>

              {/* Center Header Text */}
              <div style={{ flex: 1, textAlign: 'center', margin: '0 20px' }}>
                <div
                  style={{
                    fontSize: '11px',
                    fontWeight: '600',
                    letterSpacing: '1.2px',
                    color: '#1e3a2a',
                    marginBottom: '4px',
                  }}
                >
                  GOVERNMENT OF BANGLADESH
                </div>
                <div
                  style={{
                    fontSize: '22px',
                    fontWeight: '700',
                    color: '#1e3a2a',
                    marginBottom: '6px',
                    letterSpacing: '0.5px',
                  }}
                >
                  BANGLADESH ARMY
                </div>
                <div
                  style={{
                    fontSize: '12px',
                    fontWeight: '500',
                    color: '#4b5563',
                    letterSpacing: '0.3px',
                  }}
                >
                  MOVEMENT PERMISSION CERTIFICATE
                </div>
              </div>

              {/* Right Seal */}
              <div
                style={{
                  width: '70px',
                  height: '70px',
                  flexShrink: 0,
                  border: '3px solid #1e3a2a',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: '#f9faf8',
                  position: 'relative',
                }}
              >
                <div
                  style={{
                    position: 'absolute',
                    width: '52px',
                    height: '52px',
                    border: '1.5px solid #1e3a2a',
                    borderRadius: '50%',
                  }}
                />
                <div
                  style={{
                    fontSize: '10px',
                    fontWeight: '700',
                    color: '#1e3a2a',
                    textAlign: 'center',
                    zIndex: 1,
                    lineHeight: '1.3',
                  }}
                >
                  OFFICIAL
                  <br />
                  SEAL
                </div>
              </div>
            </div>

            {/* Certificate Number and Date */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: '11px',
              }}
            >
              <div>
                <span style={{ color: '#6b7280', fontWeight: '500' }}>Certificate No. </span>
                <span style={{ fontWeight: '700', color: '#1e3a2a' }}>
                  {cert.certificateNumber}
                </span>
              </div>
              <div>
                <span style={{ color: '#6b7280', fontWeight: '500' }}>Issued Date: </span>
                <span style={{ fontWeight: '700', color: '#1e3a2a' }}>
                  {formatDate(new Date(cert.issuedAt))}
                </span>
              </div>
            </div>
          </div>

          {/* Certificate Body */}
          <div style={{ position: 'relative', zIndex: 10, flex: 1, display: 'flex', flexDirection: 'column' }}>
            {/* Preamble */}
            <div
              style={{
                textAlign: 'center',
                fontSize: '11px',
                lineHeight: '1.6',
                color: '#374151',
                marginBottom: '18px',
                fontStyle: 'italic',
              }}
            >
              This is to certify that the vehicle and personnel mentioned below are authorized to move
              <br />
              within the specified route for official military operations.
            </div>

            {/* Information Cards */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '14px' }}>
              {/* Vehicle Details */}
              <div
                style={{
                  backgroundColor: '#f0f6f3',
                  border: '1.5px solid #1e3a2a',
                  borderRadius: '4px',
                  padding: '11px 13px',
                }}
              >
                <div
                  style={{
                    fontSize: '10px',
                    fontWeight: '700',
                    color: '#1e3a2a',
                    marginBottom: '8px',
                    letterSpacing: '0.5px',
                  }}
                >
                  ▪ VEHICLE DETAILS
                </div>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr 1fr',
                    gap: '16px',
                  }}
                >
                  <div>
                    <div
                      style={{
                        fontSize: '9px',
                        color: '#6b7280',
                        fontWeight: '600',
                        marginBottom: '3px',
                      }}
                    >
                      VEHICLE NUMBER
                    </div>
                    <div
                      style={{
                        fontSize: '11px',
                        fontWeight: '700',
                        color: '#1a1a1a',
                      }}
                    >
                      {cert.vehicleDetails.number}
                    </div>
                  </div>
                  <div>
                    <div
                      style={{
                        fontSize: '9px',
                        color: '#6b7280',
                        fontWeight: '600',
                        marginBottom: '3px',
                      }}
                    >
                      VEHICLE TYPE
                    </div>
                    <div
                      style={{
                        fontSize: '11px',
                        fontWeight: '700',
                        color: '#1a1a1a',
                      }}
                    >
                      {cert.vehicleDetails.type}
                    </div>
                  </div>
                  <div>
                    <div
                      style={{
                        fontSize: '9px',
                        color: '#6b7280',
                        fontWeight: '600',
                        marginBottom: '3px',
                      }}
                    >
                      DRIVER NAME
                    </div>
                    <div
                      style={{
                        fontSize: '11px',
                        fontWeight: '700',
                        color: '#1a1a1a',
                      }}
                    >
                      {cert.vehicleDetails.driver}
                    </div>
                  </div>
                </div>
              </div>

              {/* Route Details */}
              <div
                style={{
                  backgroundColor: '#f0f4ff',
                  border: '1.5px solid #1e40af',
                  borderRadius: '4px',
                  padding: '11px 13px',
                }}
              >
                <div
                  style={{
                    fontSize: '10px',
                    fontWeight: '700',
                    color: '#1e3a8a',
                    marginBottom: '8px',
                    letterSpacing: '0.5px',
                  }}
                >
                  ▪ AUTHORIZED ROUTE
                </div>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr 1fr',
                    gap: '16px',
                  }}
                >
                  <div>
                    <div
                      style={{
                        fontSize: '9px',
                        color: '#6b7280',
                        fontWeight: '600',
                        marginBottom: '3px',
                      }}
                    >
                      FROM
                    </div>
                    <div
                      style={{
                        fontSize: '11px',
                        fontWeight: '700',
                        color: '#1a1a1a',
                      }}
                    >
                      {cert.routeDetails.from}
                    </div>
                  </div>
                  <div>
                    <div
                      style={{
                        fontSize: '9px',
                        color: '#6b7280',
                        fontWeight: '600',
                        marginBottom: '3px',
                      }}
                    >
                      TO
                    </div>
                    <div
                      style={{
                        fontSize: '11px',
                        fontWeight: '700',
                        color: '#1a1a1a',
                      }}
                    >
                      {cert.routeDetails.to}
                    </div>
                  </div>
                  <div>
                    <div
                      style={{
                        fontSize: '9px',
                        color: '#6b7280',
                        fontWeight: '600',
                        marginBottom: '3px',
                      }}
                    >
                      VIA
                    </div>
                    <div
                      style={{
                        fontSize: '11px',
                        fontWeight: '700',
                        color: '#1a1a1a',
                      }}
                    >
                      {cert.routeDetails.via || '—'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Validity Period */}
              <div
                style={{
                  backgroundColor: '#f0fdf4',
                  border: '1.5px solid #15803d',
                  borderRadius: '4px',
                  padding: '11px 13px',
                }}
              >
                <div
                  style={{
                    fontSize: '10px',
                    fontWeight: '700',
                    color: '#15803d',
                    marginBottom: '8px',
                    letterSpacing: '0.5px',
                  }}
                >
                  ▪ VALIDITY PERIOD
                </div>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '20px',
                  }}
                >
                  <div>
                    <div
                      style={{
                        fontSize: '9px',
                        color: '#6b7280',
                        fontWeight: '600',
                        marginBottom: '3px',
                      }}
                    >
                      VALID FROM
                    </div>
                    <div
                      style={{
                        fontSize: '11px',
                        fontWeight: '700',
                        color: '#1a1a1a',
                      }}
                    >
                      {formatDate(new Date(cert.validFrom))}
                    </div>
                  </div>
                  <div>
                    <div
                      style={{
                        fontSize: '9px',
                        color: '#6b7280',
                        fontWeight: '600',
                        marginBottom: '3px',
                      }}
                    >
                      VALID TO
                    </div>
                    <div
                      style={{
                        fontSize: '11px',
                        fontWeight: '700',
                        color: '#1a1a1a',
                      }}
                    >
                      {formatDate(new Date(cert.validTo))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Terms and Conditions */}
            <div
              style={{
                backgroundColor: '#fafaf9',
                border: '1px solid #e5e7eb',
                borderRadius: '4px',
                padding: '9px 11px',
                fontSize: '9px',
                lineHeight: '1.5',
                color: '#555',
              }}
            >
              <div style={{ fontWeight: '600', color: '#1e3a2a', marginBottom: '4px' }}>
                CONDITIONS:
              </div>
              <ul style={{ margin: 0, paddingLeft: '16px' }}>
                <li>Valid only for the specified period and authorized route</li>
                <li>Must comply with all traffic and military protocols</li>
                <li>Non-transferable; must be carried during travel</li>
                <li>Unauthorized deviation from route is prohibited</li>
              </ul>
            </div>
          </div>

          {/* Signature Section */}
          <div
            style={{
              position: 'relative',
              zIndex: 10,
              marginTop: '18px',
              paddingTop: '12px',
              borderTop: '2px solid #1e3a2a',
            }}
          >
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr 1fr',
                gap: '24px',
                fontSize: '10px',
              }}
            >
              {/* Officer Signature */}
              <div style={{ textAlign: 'left' }}>
                <div
                  style={{
                    height: '48px',
                    marginBottom: '6px',
                    borderBottom: '1px solid #9ca3af',
                  }}
                />
                <div style={{ fontWeight: '700', color: '#1a1a1a', fontSize: '11px' }}>
                  {cert.authorizedBy}
                </div>
                <div style={{ color: '#6b7280', fontSize: '9px', marginTop: '2px' }}>
                  Authorized Officer
                </div>
                <div style={{ color: '#6b7280', fontSize: '9px' }}>Bangladesh Army</div>
              </div>

              {/* Document ID */}
              <div
                style={{
                  textAlign: 'center',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'flex-end',
                }}
              >
                <div style={{ color: '#6b7280', fontSize: '9px', marginBottom: '2px' }}>
                  Document ID
                </div>
                <div style={{ fontWeight: '700', color: '#1a1a1a', fontSize: '11px' }}>
                  {cert.requestId}
                </div>
              </div>

              {/* Official Stamp */}
              <div
                style={{
                  textAlign: 'right',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'flex-end',
                }}
              >
                <div
                  style={{
                    width: '60px',
                    height: '60px',
                    border: '2px solid #1e3a2a',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginLeft: 'auto',
                    backgroundColor: '#f9faf8',
                    fontSize: '8px',
                    fontWeight: '700',
                    color: '#1e3a2a',
                    textAlign: 'center',
                    lineHeight: '1.2',
                  }}
                >
                  OFFICIAL
                  <br />
                  STAMP
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Disclaimer */}
          <div
            style={{
              position: 'relative',
              zIndex: 10,
              textAlign: 'center',
              fontSize: '9px',
              color: '#9ca3af',
              marginTop: '10px',
              paddingTop: '8px',
              borderTop: '1px solid #e5e7eb',
            }}
          >
            <p style={{ margin: 0 }}>
              This is an officially issued certificate by Bangladesh Army. For verification, contact the issuing authority.
            </p>
          </div>
        </div>

        {/* Bottom Decorative Border */}
        <div
          style={{
            height: '8px',
            background: 'linear-gradient(90deg, #1e3a2a 0%, #2d5a3d 50%, #1e3a2a 100%)',
            width: '100%',
          }}
        />
      </div>
    </div>
  );
});

CertificateDesign.displayName = 'CertificateDesign';
export default CertificateDesign;