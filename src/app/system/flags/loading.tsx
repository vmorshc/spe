function FlagRowSkeleton() {
  return (
    <div className="flex items-center justify-between py-4 border-b border-gray-100">
      <div className="space-y-2">
        <div className="h-5 bg-gray-200 rounded w-40 motion-safe:animate-pulse" />
        <div className="h-4 bg-gray-200 rounded w-64 motion-safe:animate-pulse" />
      </div>
      <div className="w-11 h-6 bg-gray-200 rounded-full motion-safe:animate-pulse" />
    </div>
  );
}

export default function Loading() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="mb-8">
            <div className="h-8 bg-gray-200 rounded w-64 mb-2 motion-safe:animate-pulse" />
            <div className="h-5 bg-gray-200 rounded w-96 motion-safe:animate-pulse" />
          </div>

          {/* Toggle rows skeleton */}
          <div className="space-y-4">
            <FlagRowSkeleton />
            <FlagRowSkeleton />
            <FlagRowSkeleton />
            <FlagRowSkeleton />
            <FlagRowSkeleton />
          </div>
        </div>
      </div>
    </div>
  );
}
