'use client';

import { AlertCircle, RefreshCw } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Button } from '@/components/ui/Button';

interface ErrorPageProps {
  error: globalThis.Error & { digest?: string };
  reset: () => void;
}

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  const router = useRouter();
  useEffect(() => {
    // Log error details for debugging
    console.error('Instagram posts error:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="max-w-md w-full mx-auto text-center">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <div className="flex justify-center mb-4">
            <AlertCircle className="w-12 h-12 text-red-500" />
          </div>

          <h1 className="text-2xl font-bold text-gray-900 mb-2">Щось пішло не так</h1>

          <p className="text-gray-600 mb-6">
            Не вдалося завантажити ваші Instagram публікації. Це може бути через:
          </p>

          <ul className="text-left text-sm text-gray-600 mb-6 space-y-2">
            <li>• Проблеми з мережевим з'єднанням</li>
            <li>• Обмеження Instagram API</li>
            <li>• Тимчасові технічні роботи</li>
            <li>• Зміни дозволів у вашому Facebook акаунті</li>
          </ul>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button onClick={reset} className="flex items-center justify-center">
              <RefreshCw className="w-4 h-4 mr-2" />
              Спробувати знову
            </Button>

            <Button
              variant="outline"
              onClick={() => {
                router.push('/');
              }}
              className="flex items-center justify-center"
            >
              На головну
            </Button>
          </div>

          {error.digest && <p className="text-xs text-gray-400 mt-6">Error ID: {error.digest}</p>}
        </div>
      </div>
    </div>
  );
}
