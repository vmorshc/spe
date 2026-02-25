'use client';

import { RefreshCw } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { refreshInstagramData } from '@/lib/actions/instagram';
import type { InstagramProfile } from '@/lib/facebook/types';

interface ProfileHeaderProps {
  profile: InstagramProfile;
}

export default function ProfileHeader({ profile }: ProfileHeaderProps) {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const router = useRouter();

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await refreshInstagramData();
      router.refresh();
    } catch (error) {
      console.error('Failed to refresh Instagram data:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <div className="border-b border-gray-200 pb-6 sm:pb-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4 sm:space-x-8 min-w-0">
          <div className="relative w-20 h-20 sm:w-32 sm:h-32 flex-shrink-0">
            <Image
              src={profile.profile_picture_url}
              alt={profile.username}
              fill
              className="rounded-full object-cover"
              sizes="(max-width: 640px) 80px, 128px"
              priority
            />
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-2 mb-2 sm:mb-4">
              <h1 className="text-xl sm:text-2xl font-light text-gray-900 truncate">
                {profile.username}
              </h1>
              <button
                type="button"
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50 flex-shrink-0"
                aria-label="Оновити"
              >
                <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              </button>
            </div>

            <div className="flex items-center space-x-4 sm:space-x-8 text-sm sm:text-base mb-2 sm:mb-4">
              <div>
                <span className="font-semibold text-gray-900">
                  {profile.media_count.toLocaleString()}
                </span>
                <span className="text-gray-500 ml-1">posts</span>
              </div>

              <div>
                <span className="font-semibold text-gray-900">
                  {profile.followers_count.toLocaleString()}
                </span>
                <span className="text-gray-500 ml-1">followers</span>
              </div>
            </div>

            <div className="space-y-0.5 sm:space-y-1">
              {profile.name && (
                <p className="text-sm sm:text-base font-semibold text-gray-900">{profile.name}</p>
              )}
              {profile.biography && (
                <p className="hidden sm:block text-sm text-gray-700 max-w-md line-clamp-3">
                  {profile.biography}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
