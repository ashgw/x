'use client';

import { useEffect } from 'react';

export default function Error({
  error,
}: {
  error: Error & { digest?: string };
}) {
  useEffect(() => {
    // TODO: handle this better G
    console.error(error);
  }, [error]);
  return (
    <div className="flex items-center justify-center h-screen">
      Error | Something happened, try refreshing.
    </div>
  );
}
