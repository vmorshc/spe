'use client';

interface Props {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorPage({ error, reset }: Props) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md w-full mx-auto text-center">
        <div className="bg-white rounded-lg p-8 shadow-sm">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Сталася помилка</h1>
          <p className="text-gray-600 mb-6">Не вдалося завантажити сторінку експорту</p>
          <div className="space-y-3">
            <button
              type="button"
              onClick={reset}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded"
            >
              Спробувати ще раз
            </button>
            <a href="/app/instagram/posts" className="block w-full">
              <button type="button" className="w-full px-4 py-2 border border-gray-300 rounded">
                На головну
              </button>
            </a>
          </div>
          {error.digest && <p className="text-xs text-gray-400 mt-6">{error.digest}</p>}
        </div>
      </div>
    </div>
  );
}
