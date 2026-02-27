'use client';

import { useEffect } from 'react';
import { trackEvent } from '@/lib/analytics';

interface PostsGridTrackerProps {
  profileUsername: string;
  followersCount: number;
  postsLoadedCount: number;
}

export default function PostsGridTracker({
  profileUsername,
  followersCount,
  postsLoadedCount,
}: PostsGridTrackerProps) {
  useEffect(() => {
    trackEvent('posts_grid_view', {
      profile_username: profileUsername,
      followers_count: followersCount,
      posts_loaded_count: postsLoadedCount,
    });
  }, [profileUsername, followersCount, postsLoadedCount]);

  return null;
}
