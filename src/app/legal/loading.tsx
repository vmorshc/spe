export default function LegalLoading() {
  return (
    <div className="legal-loading">
      <div className="animate-pulse">
        {/* Title skeleton */}
        <div className="h-10 bg-gray-200 rounded-md w-3/4 mb-8"></div>

        {/* Content skeleton */}
        <div className="space-y-6">
          <div className="space-y-3">
            <div className="h-6 bg-gray-200 rounded w-1/2"></div>
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          </div>

          <div className="space-y-3">
            <div className="h-6 bg-gray-200 rounded w-1/3"></div>
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
          </div>

          <div className="space-y-3">
            <div className="h-6 bg-gray-200 rounded w-2/5"></div>
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-4/5"></div>
          </div>

          <div className="space-y-3">
            <div className="h-6 bg-gray-200 rounded w-1/2"></div>
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-3/5"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
