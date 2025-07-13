'use client';

import { motion } from 'framer-motion';
import { XCircle } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function AuthErrorContent() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error');
  const description = searchParams.get('description');

  const getErrorMessage = (errorCode: string | null) => {
    switch (errorCode) {
      case 'access_denied':
        return 'Ви відхилили доступ до Instagram. Для використання сервісу необхідно надати дозвіл.';
      case 'invalid_state':
        return 'Помилка безпеки. Спробуйте увійти ще раз.';
      case 'missing_code':
        return 'Не отримано код авторизації від Instagram.';
      case 'missing_state':
        return 'Відсутній параметр безпеки. Спробуйте увійти ще раз.';
      case 'callback_error':
        return 'Помилка обробки відповіді від Instagram.';
      case 'no_instagram_accounts':
        return 'У вас немає підключених бізнес-акаунтів Instagram. Створіть бізнес-акаунт та підключіть його до сторінки Facebook.';
      case 'token_exchange_failed':
        return 'Не вдалося обмінати код на токен доступу. Спробуйте увійти ще раз.';
      default:
        return 'Сталася невідома помилка під час автентифікації.';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center"
    >
      <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Помилка автентифікації</h1>
      <p className="text-gray-600 mb-4">{getErrorMessage(error)}</p>

      {/* Development mode error details */}
      {process.env.NODE_ENV === 'development' && (
        <div className="text-left bg-gray-100 p-4 rounded-lg mb-4">
          <h3 className="font-semibold text-gray-900 mb-2">Деталі помилки (dev):</h3>
          <p className="text-sm text-gray-600 mb-1">
            <strong>Error:</strong> {error || 'unknown'}
          </p>
          {description && (
            <p className="text-sm text-gray-600">
              <strong>Description:</strong> {description}
            </p>
          )}
        </div>
      )}

      <div className="space-y-3">
        <button
          type="button"
          onClick={() => {
            window.location.href = '/';
          }}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Спробувати знову
        </button>
        <button
          type="button"
          onClick={() => {
            window.location.href = '/';
          }}
          className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors"
        >
          Повернутися на головну
        </button>
      </div>
    </motion.div>
  );
}

function LoadingFallback() {
  return (
    <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
      <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-red-500 mx-auto mb-4"></div>
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Завантаження...</h1>
      <p className="text-gray-600">Обробка помилки автентифікації</p>
    </div>
  );
}

export default function AuthErrorPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <Suspense fallback={<LoadingFallback />}>
        <AuthErrorContent />
      </Suspense>
    </div>
  );
}
