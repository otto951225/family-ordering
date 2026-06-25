export function LoadingSkeleton() {
  return (
    <div className="grid grid-cols-[88px_1fr] gap-3 p-3 pb-28">
      <div className="flex flex-col gap-2">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="h-14 rounded-md bg-muted" />
        ))}
      </div>
      <div className="grid grid-cols-2 gap-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="h-40 rounded-md bg-muted" />
        ))}
      </div>
    </div>
  );
}
