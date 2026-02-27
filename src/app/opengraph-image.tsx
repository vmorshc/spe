import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export const alt = 'Pickly — Чесні розіграші в Instagram';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OgImage() {
  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)',
        fontFamily: 'sans-serif',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          marginBottom: '32px',
        }}
      >
        <div
          style={{
            width: '80px',
            height: '80px',
            borderRadius: '20px',
            background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '40px',
            color: 'white',
            fontWeight: 700,
          }}
        >
          P
        </div>
        <div
          style={{
            fontSize: '64px',
            fontWeight: 700,
            color: 'white',
            letterSpacing: '-1px',
          }}
        >
          Pickly
        </div>
      </div>
      <div
        style={{
          fontSize: '32px',
          color: '#94a3b8',
          textAlign: 'center',
          maxWidth: '800px',
          lineHeight: 1.4,
        }}
      >
        Чесні розіграші в Instagram
      </div>
      <div
        style={{
          fontSize: '20px',
          color: '#64748b',
          textAlign: 'center',
          maxWidth: '700px',
          marginTop: '16px',
          lineHeight: 1.5,
        }}
      >
        Обери переможця за хвилину — прозоро і без сумнівів
      </div>
    </div>,
    { ...size }
  );
}
