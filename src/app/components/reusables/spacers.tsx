import React from 'react';

export function Spacer1({ children }: { children: React.ReactNode }) {
  return <div className="my-1">{children}</div>;
}
export function Spacer2({ children }: { children: React.ReactNode }) {
  return <div className="my-2">{children}</div>;
}
export function Spacer3({ children }: { children: React.ReactNode }) {
  return <div className="my-4">{children}</div>;
}
