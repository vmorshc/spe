export default function Loading() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-4 motion-safe:animate-pulse" />
        <div className="h-7 bg-gray-200 rounded w-3/4 mx-auto mb-2 motion-safe:animate-pulse" />
        <div className="h-5 bg-gray-200 rounded w-full mb-4 motion-safe:animate-pulse" />
        <div className="space-y-3">
          <div className="h-10 bg-gray-200 rounded-lg w-full motion-safe:animate-pulse" />
          <div className="h-10 bg-gray-200 rounded-lg w-full motion-safe:animate-pulse" />
        </div>
      </div>
    </div>
  );
}
