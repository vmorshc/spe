export default function Loading() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header skeleton */}
      <div className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gray-200 rounded-lg motion-safe:animate-pulse" />
              <div className="w-20 h-5 bg-gray-200 rounded motion-safe:animate-pulse" />
            </div>
            <div className="hidden md:flex items-center gap-8">
              <div className="w-24 h-4 bg-gray-200 rounded motion-safe:animate-pulse" />
              <div className="w-16 h-4 bg-gray-200 rounded motion-safe:animate-pulse" />
              <div className="w-12 h-4 bg-gray-200 rounded motion-safe:animate-pulse" />
            </div>
            <div className="w-24 h-9 bg-gray-200 rounded-md motion-safe:animate-pulse" />
          </div>
        </div>
      </div>

      {/* Hero skeleton */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 lg:pt-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="text-center lg:text-left flex flex-col items-center lg:items-start">
            <div className="w-full max-w-lg space-y-3 mb-6">
              <div className="h-10 bg-gray-200 rounded motion-safe:animate-pulse" />
              <div className="h-10 bg-gray-200 rounded w-3/4 motion-safe:animate-pulse" />
            </div>
            <div className="w-full max-w-md space-y-2 mb-8">
              <div className="h-5 bg-gray-200 rounded motion-safe:animate-pulse" />
              <div className="h-5 bg-gray-200 rounded w-5/6 motion-safe:animate-pulse" />
            </div>
            <div className="h-14 w-48 bg-gray-200 rounded-xl motion-safe:animate-pulse mb-8" />
          </div>
          <div className="h-80 bg-gray-200 rounded-2xl motion-safe:animate-pulse" />
        </div>
      </div>
    </div>
  );
}
