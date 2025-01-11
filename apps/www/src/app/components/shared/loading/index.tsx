'use client';

import LoadingPoints from 'loading-points';
import type { Pixel, RGB } from 'loading-points';

export function Loading() {
  const glowColor = 'rgb(155, 46, 199)' as RGB;
  const circleSize = '8px' as Pixel;

  return <LoadingPoints glowColor={glowColor} circleSize={circleSize} />;
}
