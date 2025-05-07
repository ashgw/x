export function NotFound({ message }: { message?: string }) {
  return (
    <div className="flex h-screen items-center justify-center">
      {message ?? "404 | Resource not found."}
    </div>
  );
}
