'use client';

import { usePathname, useSearchParams } from 'next/navigation';
import LoginButton from './LoginButton';

interface RedirectBackLoginButtonProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
}

/**
 * LoginButton wrapper that automatically captures the current URL for redirect
 * Uses client-side hooks to build relative URL (path + query params)
 */
export default function RedirectBackLoginButton({
  size = 'lg',
  className = 'w-full justify-center',
  variant = 'primary',
}: RedirectBackLoginButtonProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Build relative URL with path and query params
  const currentUrl = pathname + (searchParams.toString() ? `?${searchParams.toString()}` : '');

  return (
    <LoginButton size={size} className={className} variant={variant} redirectUrl={currentUrl} />
  );
}
