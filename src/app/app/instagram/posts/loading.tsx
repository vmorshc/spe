export default function Loading() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Profile header skeleton */}
        <div className="flex justify-center mb-8">
          <div className="w-full max-w-4xl">
            <div className="p-6">
              <div className="flex items-center space-x-6">
                <div className="w-20 h-20 bg-gray-200 rounded-full animate-pulse"></div>
                <div className="flex-1">
                  <div className="h-6 bg-gray-200 rounded w-32 mb-2 animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded w-48 mb-4 animate-pulse"></div>
                  <div className="flex space-x-8">
                    <div className="h-4 bg-gray-200 rounded w-16 animate-pulse"></div>
                    <div className="h-4 bg-gray-200 rounded w-20 animate-pulse"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs skeleton */}
        <div className="flex justify-center">
          <div className="w-full max-w-3xl">
            <div className="border-b border-gray-200 mb-8">
              <nav className="flex justify-center space-x-16">
                <div className="py-3 px-1 h-10 bg-gray-200 rounded w-16 animate-pulse"></div>
                <div className="py-3 px-1 h-10 bg-gray-200 rounded w-20 animate-pulse"></div>
              </nav>
            </div>

            {/* Posts grid skeleton */}
            <div className="grid grid-cols-3 gap-1">
              {Array.from({ length: 12 }, (_, i) => (
                <div
                  key={`skeleton-${i}-${Math.random()}`}
                  className="aspect-square bg-gray-200 animate-pulse"
                ></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
