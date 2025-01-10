'use client';

import * as loading from 'loading-points';

export function Loading() {
  const glowColor = 'rgb(155, 46, 199)' as loading.RGB;
  const circleSize = '8px' as loading.Pixel;

  return <loading.default glowColor={glowColor} circleSize={circleSize} />;
}
