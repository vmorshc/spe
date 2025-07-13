'use client';

import { ChevronDown, LogOut } from 'lucide-react';
import { useState } from 'react';
import Button from '@/components/ui/Button';
import { useAuth } from '@/lib/contexts/AuthContext';

interface UserProfileProps {
  className?: string;
}

export default function UserProfile({ className = '' }: UserProfileProps) {
  const { user, isLoading, logout } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    setIsDropdownOpen(false);
    try {
      await logout();
    } catch (err) {
      console.error('Logout failed:', err);
    } finally {
      setIsLoggingOut(false);
    }
  };

  if (isLoading) {
    return (
      <div className={`flex items-center ${className}`}>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className={`relative ${className}`}>
      <Button
        variant="ghost"
        size="sm"
        className="flex items-center space-x-2 p-2"
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        disabled={isLoggingOut}
      >
        <img
          src={user.profilePicture}
          alt={user.username}
          className="w-8 h-8 rounded-full"
          onError={(e) => {
            e.currentTarget.src = '/api/placeholder/32/32';
          }}
        />
        <div className="hidden sm:block text-left">
          <div className="text-sm font-medium text-gray-900">@{user.username}</div>
          <div className="text-xs text-gray-500">{user.pageName}</div>
        </div>
        <ChevronDown className="w-4 h-4 text-gray-500" />
      </Button>

      {isDropdownOpen && (
        <>
          <button
            type="button"
            className="fixed inset-0 z-10 bg-transparent border-none outline-none cursor-default"
            onClick={() => setIsDropdownOpen(false)}
            onKeyDown={(e) => {
              if (e.key === 'Escape') setIsDropdownOpen(false);
            }}
            aria-label="Close dropdown"
          />
          <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border z-20">
            <div className="p-4 border-b">
              <div className="flex items-center space-x-3">
                <img
                  src={user.profilePicture}
                  alt={user.username}
                  className="w-10 h-10 rounded-full"
                  onError={(e) => {
                    e.currentTarget.src = '/api/placeholder/40/40';
                  }}
                />
                <div>
                  <div className="font-medium text-gray-900">@{user.username}</div>
                  <div className="text-sm text-gray-500">{user.pageName}</div>
                  <div className="text-xs text-gray-400">
                    {user.followersCount.toLocaleString()} підписників
                  </div>
                </div>
              </div>
            </div>

            <div className="p-2">
              <button
                type="button"
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="w-full flex items-center px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md transition-colors disabled:opacity-50"
              >
                {isLoggingOut ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600 mr-2"></div>
                    Виходжу...
                  </>
                ) : (
                  <>
                    <LogOut className="w-4 h-4 mr-2" />
                    Вийти
                  </>
                )}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
