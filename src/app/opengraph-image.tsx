import { ImageResponse } from 'next/og';

export const alt = 'Ashgw';
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = 'image/png';
export default async function Image() {
  return new ImageResponse(
    (
      <div
        className="gradient-bg"
        style={{
          fontSize: 128,
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <span className="dimmed-4">A S H G W</span>
      </div>
    ),
    {
      ...size,
    }
  );
}
