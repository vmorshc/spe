'use client';

import { ArrowLeft, LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { sharedConfig } from '@/config';
import { useAuth } from '@/lib/contexts/AuthContext';

interface AppHeaderProps {
  title: string;
  backUrl?: string;
  showBackButton?: boolean;
}

export default function AppHeader({ title, backUrl = '/', showBackButton = true }: AppHeaderProps) {
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const router = useRouter();
  const { logout } = useAuth();

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
      router.push('/');
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  const handleBackClick = () => {
    router.push(backUrl);
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Back Button */}
          <div className="flex items-center space-x-4">
            {showBackButton && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleBackClick}
                className="flex items-center text-gray-700 hover:text-blue-600 transition-colors"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">Назад</span>
              </Button>
            )}

            {showBackButton && <div className="h-6 w-px bg-gray-200 hidden sm:block" />}

            <button
              type="button"
              onClick={() => router.push('/')}
              className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
            >
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">SP</span>
              </div>
              <span className="text-xl font-bold text-gray-900 hidden sm:inline">
                {sharedConfig.SITE_NAME}
              </span>
            </button>
          </div>

          {/* Page Title */}
          <div className="flex-1 text-left ml-4">
            <h1 className="text-lg font-medium text-gray-900">{title}</h1>
          </div>

          {/* Logout Button */}
          <div className="flex items-center">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="flex items-center text-gray-700 hover:text-red-600 transition-colors"
            >
              <LogOut className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">{isLoggingOut ? 'Вихід...' : 'Вийти'}</span>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
