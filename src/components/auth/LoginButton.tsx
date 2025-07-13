'use client';

import { Instagram } from 'lucide-react';
import { useState } from 'react';
import Button from '@/components/ui/Button';
import { initiateOAuthLogin } from '@/lib/actions/auth';
import { useAuth } from '@/lib/contexts/AuthContext';

interface LoginButtonProps {
  className?: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  redirectUrl?: string;
}

export default function LoginButton({
  className = '',
  variant = 'primary',
  size = 'md',
  redirectUrl,
}: LoginButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  useAuth();

  const handleLogin = async () => {
    try {
      setIsLoading(true);
      await initiateOAuthLogin({ redirectUrl });
      // Auth state will be refreshed when user returns from OAuth
    } catch (error) {
      console.error('Login failed:', error);
      setIsLoading(false);
    }
  };

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
