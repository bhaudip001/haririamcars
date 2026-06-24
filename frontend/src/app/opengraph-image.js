import { ImageResponse } from 'next/og';

export const runtime = 'nodejs';
export const alt = 'Hariram Motors — Verified Cars in Surat';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          background: '#0a0a12',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'Inter, sans-serif',
        }}
      >
        <div style={{
          fontSize: 72,
          fontWeight: 800,
          color: 'white',
          marginBottom: 16,
        }}>
          Hariram Motors
        </div>
        <div style={{
          fontSize: 32,
          color: '#a855f7',
          marginBottom: 24,
        }}>
          Verified Pre-Owned Cars · Surat
        </div>
        <div style={{
          fontSize: 24,
          color: '#a0a0b8',
        }}>
          +91 98985 58222 · harirammotors.com
        </div>
      </div>
    ),
    { ...size }
  );
}
