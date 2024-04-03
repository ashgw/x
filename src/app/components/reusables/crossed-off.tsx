import React from 'react';

export default function CrossedOff({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <span className="line-through bg-gradient-to-r from-gray-500 to-gray-200 text-transparent bg-clip-text">
      {children}
    </span>
  );
}
