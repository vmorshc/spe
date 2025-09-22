export default function Loading() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        <div className="h-6 w-48 bg-gray-200 rounded animate-pulse" />
        <div className="h-10 w-64 bg-gray-200 rounded animate-pulse" />
        <div className="space-y-3">
          {Array.from({ length: 8 }, () => (
            <div
              key={`skeleton-${crypto.randomUUID()}`}
              className="h-16 bg-gray-100 rounded animate-pulse"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
