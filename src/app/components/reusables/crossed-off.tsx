import React from 'react';

export default function CrossedOff({
  children,
}: {
  children: React.ReactNode;
}) {
  return <s>{children}</s>;
}
