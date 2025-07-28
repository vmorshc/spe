'use client';

import { useState, useTransition } from 'react';
import { toggleFeatureFlagAction } from '@/lib/actions/featureFlags';
import type { FeatureFlagDefinition } from '@/lib/featureFlags/constants';

interface FeatureFlagsClientProps {
  initialFlags: Record<string, boolean>;
  flagDefinitions: FeatureFlagDefinition[];
}

export default function FeatureFlagsClient({
  initialFlags,
  flagDefinitions,
}: FeatureFlagsClientProps) {
  const [flags, setFlags] = useState(initialFlags);
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<string>('');

  const handleToggle = async (flagName: string) => {
    startTransition(async () => {
      const result = await toggleFeatureFlagAction(flagName as any);

      if (result.success) {
        // Update local state
        setFlags((prev) => ({
          ...prev,
          [flagName]: result.newValue ?? false,
        }));

        setMessage(result.message || 'Прапорець функції оновлено');

        // Clear message after 3 seconds
        setTimeout(() => setMessage(''), 3000);
      } else {
        setMessage(`Помилка: ${result.error || 'Невідома помилка'}`);
        setTimeout(() => setMessage(''), 5000);
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* Status Message */}
      {message && (
        <div
          className={`p-4 rounded-lg ${
            message.startsWith('Помилка')
              ? 'bg-red-50 text-red-800 border border-red-200'
              : 'bg-green-50 text-green-800 border border-green-200'
          }`}
        >
          {message}
        </div>
      )}

      {/* Feature Flags List */}
      <div className="space-y-4">
        {flagDefinitions.map((flagDef) => {
          const isEnabled = flags[flagDef.name] ?? flagDef.defaultValue;

          return (
            <div
              key={flagDef.name}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border"
            >
              <div className="flex-1">
                <div className="flex items-center space-x-3">
                  <h3 className="text-lg font-medium text-gray-900">{flagDef.displayName}</h3>
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded-full ${
                      isEnabled ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {isEnabled ? 'Увімкнено' : 'Вимкнено'}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mt-1">{flagDef.description}</p>
                <p className="text-xs text-gray-500 mt-1">
                  Назва прапорця: <code className="bg-gray-200 px-1 rounded">{flagDef.name}</code>
                </p>
              </div>

              <div className="ml-4">
                <button
                  type="button"
                  disabled={isPending}
                  onClick={() => handleToggle(flagDef.name)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 ${
                    isEnabled ? 'bg-blue-600' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      isEnabled ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Loading State */}
      {isPending && (
        <div className="flex items-center justify-center p-4">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
          <span className="ml-2 text-sm text-gray-600">Оновлення...</span>
        </div>
      )}

      {/* Additional Info */}
      <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <h4 className="text-sm font-medium text-blue-900 mb-2">Про прапорці функцій</h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Прапорці функцій зберігаються у вашій сесії та зберігаються до закінчення сесії</li>
          <li>• Зміни набувають чинності миттєво в усьому додатку</li>
          <li>• Прапорці специфічні для сесії та не вплинуть на інших користувачів</li>
          <li>
            • Відключені прапорці можуть показувати повідомлення "скоро" або повністю приховувати
            функції
          </li>
        </ul>
      </div>
    </div>
  );
}
