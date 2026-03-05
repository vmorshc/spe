'use client';

import { Instagram } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { initiateOAuthLogin } from '@/lib/actions/auth';
import { trackEvent } from '@/lib/analytics';
import { useAuth } from '@/lib/contexts/AuthContext';

interface LoginButtonProps {
  className?: string;
  variant?: 'default' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'default' | 'lg';
  redirectUrl?: string;
  disabled?: boolean;
}

export default function LoginButton({
  className = '',
  variant = 'default',
  size = 'default',
  redirectUrl,
  disabled = false,
}: LoginButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  useAuth();

  const handleLogin = async () => {
    try {
      setIsLoading(true);
      trackEvent('login_start', {
        auth_provider: 'facebook',
        entry_point: redirectUrl || 'header',
      });
      await initiateOAuthLogin({ redirectUrl });
      // Auth state will be refreshed when user returns from OAuth
    } catch (error) {
      console.error('Login failed:', error);
      setIsLoading(false);
    }
  };

  if (disabled) {
    return (
      <button
        type="button"
        className={`flex items-center space-x-2 text-gray-400 cursor-not-allowed px-4 py-2 rounded-lg ${className}`}
        disabled
      >
        <Instagram className="w-4 h-4" />
        <span>Увійти через Instagram</span>
        <span className="ml-2 text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">Незабаром</span>
      </button>
    );
  }

  return (
    <Button
      variant={variant}
      size={size}
      className={`flex items-center space-x-2 ${className}`}
      onClick={handleLogin}
      disabled={isLoading}
    >
      <Instagram className="w-4 h-4" />
      <span>{isLoading ? 'Підключення...' : 'Увійти через Instagram'}</span>
    </Button>
  );
}
