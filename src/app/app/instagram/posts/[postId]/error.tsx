'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/Button';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorPage({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log the error to error reporting service
    console.error('Post detail page error:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md w-full mx-auto text-center">
        <div className="bg-white rounded-lg p-8 shadow-sm">
          <div className="w-16 h-16 mx-auto mb-6 bg-red-100 rounded-full flex items-center justify-center">
            <svg
              className="w-8 h-8 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <title>Error Icon</title>
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 18.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>

          <h1 className="text-2xl font-bold text-gray-900 mb-4">Сталася помилка</h1>

          <p className="text-gray-600 mb-6">
            Не вдалося завантажити деталі публікації. Спробуйте ще раз або поверніться до списку
            постів.
          </p>

          <div className="space-y-3">
            <Button onClick={reset} variant="default" className="w-full">
              Спробувати ще раз
            </Button>

            <Button onClick={() => window.history.back()} variant="secondary" className="w-full">
              Повернутися назад
            </Button>

            <a href="/app/instagram/posts" className="block w-full">
              <Button variant="outline" className="w-full">
                Перейти до постів
              </Button>
            </a>
          </div>

          {error.digest && (
            <div className="mt-6 p-3 bg-gray-100 rounded text-sm text-gray-600">
              <p className="font-medium">Код помилки:</p>
              <p className="font-mono">{error.digest}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
