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
      <div className="text-[128px] dimmed-4 gradient-bg w-full h-full flex items-center justify-center">
        <span>A S H G W</span>
      </div>
    ),
    {
      ...size,
    }
  );
}
