export default function Loading() {
  return (
    <div className="h-full">
      {/* Giveaway Header skeleton */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="w-28 h-5 bg-gray-200 rounded motion-safe:animate-pulse" />
            <div className="w-40 h-12 bg-gray-200 rounded motion-safe:animate-pulse" />
            <div className="w-10 h-10 bg-gray-200 rounded-full motion-safe:animate-pulse" />
          </div>
        </div>
      </header>

      {/* Wizard content skeleton */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Step dots */}
        <div className="flex justify-center gap-3 mb-8">
          <div className="w-8 h-8 bg-gray-200 rounded-full motion-safe:animate-pulse" />
          <div className="w-8 h-8 bg-gray-200 rounded-full motion-safe:animate-pulse" />
          <div className="w-8 h-8 bg-gray-200 rounded-full motion-safe:animate-pulse" />
          <div className="w-8 h-8 bg-gray-200 rounded-full motion-safe:animate-pulse" />
        </div>

        {/* Content area */}
        <div className="space-y-6">
          <div className="h-8 bg-gray-200 rounded w-2/3 mx-auto motion-safe:animate-pulse" />
          <div className="h-64 bg-gray-200 rounded-lg motion-safe:animate-pulse" />
        </div>
      </div>
    </div>
  );
}
