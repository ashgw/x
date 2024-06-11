'use client';

import Loading from 'loading-points';
import type { Pixel, RGB } from 'loading-points';
import React, { useEffect, useState } from 'react';

const colors = [
  'rgb(255, 69, 0)', // Red-Orange
  'rgb(255, 0, 0)', // Red
  'rgb(255, 20, 147)', // Deep Pink
  'rgb(255, 105, 180)', // Hot Pink
  'rgb(255, 165, 0)', // Orange
  'rgb(255, 69, 0)', // Orange Red
  'rgb(255, 99, 71)', // Tomato
  'rgb(255, 140, 0)', // Dark Orange
  'rgb(255, 0, 255)', // Magenta
  'rgb(255, 182, 193)', // Light Pink
  'rgb(255, 215, 0)', // Gold
  'rgb(255, 0, 128)', // Bright Pink
  'rgb(255, 105, 97)', // Salmon Pink
  'rgb(255, 20, 147)', // Vivid Pink
  'rgb(255, 160, 122)', // Light Salmon
  'rgb(255, 69, 0)', // Vibrant Red-Orange
  'rgb(255, 228, 181)', // Moccasin
  'rgb(255, 218, 185)', // Peach Puff
  'rgb(255, 240, 245)', // Lavender Blush
  'rgb(240, 128, 128)', // Light Coral
  'rgb(230, 230, 250)', // Lavender
  'rgb(221, 160, 221)', // Plum
  'rgb(218, 112, 214)', // Orchid
  'rgb(186, 85, 211)', // Medium Orchid
  'rgb(153, 50, 204)', // Dark Orchid
  'rgb(148, 0, 211)', // Dark Violet
  'rgb(138, 43, 226)', // Blue Violet
  'rgb(139, 0, 139)', // Dark Magenta
  'rgb(148, 0, 211)', // Dark Violet
  'rgb(186, 85, 211)', // Medium Orchid
  'rgb(216, 191, 216)', // Thistle
  'rgb(255, 250, 205)', // Lemon Chiffon
  'rgb(255, 255, 224)', // Light Yellow
  'rgb(255, 255, 0)', // Yellow
  'rgb(255, 215, 0)', // Gold
  'rgb(255, 239, 213)', // Papaya Whip
  'rgb(255, 228, 181)', // Moccasin
  'rgb(255, 218, 185)', // Peach Puff
] as RGB[];

const sizes = [
  '4px',
  '8px',
  '10px',
  '12px',
  '16px',
  '20px',
  '24px',
  '30px',
  '32px',
  '40px',
  '48px',
  '56px',
  '64px',
  '72px',
  '80px',
  '88px',
  '96px',
  '100px',
] as Pixel[];

function LoadingScreen() {
  const [glowColor, setGlowColor] = useState<RGB>(colors[0]);
  const [circleSize, setCircleSize] = useState<Pixel>(sizes[0]);
  const arrayPickRandom = <A extends unknown[]>(arr: A): A[number] => {
    return arr[Math.floor(Math.random() * arr.length)];
  };
  const setConfigs = () => {
    const randomColor = arrayPickRandom(colors);
    const randomSize = arrayPickRandom(sizes);
    setGlowColor(randomColor);
    setCircleSize(randomSize);
  };

  useEffect(() => {
    const interval = setInterval(setConfigs, 3000);
    return () => clearInterval(interval);
  });

  return (
    <div className="flex items-center justify-center h-screen">
      <Loading glowColor={glowColor} circleSize={circleSize} />
    </div>
  );
}

export default LoadingScreen;
