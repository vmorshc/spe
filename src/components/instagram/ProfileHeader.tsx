'use client';

import { RefreshCw } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Button } from '@/components/ui/Button';
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
    <div className="border-b border-gray-200 pb-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-8">
          <div className="relative w-32 h-32">
            <Image
              src={profile.profile_picture_url}
              alt={profile.username}
              fill
              className="rounded-full object-cover"
              sizes="128px"
              priority
            />
          </div>

          <div>
            <h1 className="text-2xl font-light text-gray-900 mb-4">{profile.username}</h1>

            <div className="flex items-center space-x-8 text-base mb-4">
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

            <div className="space-y-1">
              {profile.name && <p className="font-semibold text-gray-900">{profile.name}</p>}
              {profile.biography && <p className="text-gray-700 max-w-md">{profile.biography}</p>}
            </div>
          </div>
        </div>

        <div className="flex-shrink-0">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="flex items-center"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            {isRefreshing ? 'Оновлення...' : 'Оновити'}
          </Button>
        </div>
      </div>
    </div>
  );
}
