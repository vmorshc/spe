import { Suspense } from 'react';
import RedirectBackLoginButton from '@/components/auth/RedirectBackLoginButton';
import { checkInstagramAccess } from '@/lib/actions/instagram';

interface AppLayoutProps {
  children: React.ReactNode;
}

async function AuthGuard({ children }: { children: React.ReactNode }) {
  const accessInfo = await checkInstagramAccess();

  if (!accessInfo.isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full mx-auto text-center">
          <div className="bg-white rounded-lg shadow-sm p-8">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-xl">SP</span>
              </div>
            </div>

            <h1 className="text-2xl font-bold text-gray-900 mb-4">Вхід до Instagram</h1>

            <p className="text-gray-600 mb-6">
              Щоб розпочати розіграш, увійдіть через ваш Instagram бізнес-акаунт
            </p>

            <RedirectBackLoginButton />

            <p className="text-xs text-gray-400 mt-4">
              Підтримуються тільки бізнес та creator акаунти
            </p>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

export default function AppLayout({ children }: AppLayoutProps) {
  return (
    <Suspense fallback={<div>Завантаження...</div>}>
      <AuthGuard>{children}</AuthGuard>
    </Suspense>
  );
}
