'use client';

import { Loader2 } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { getInstagramPosts } from '@/lib/actions/instagram';
import type { InstagramMedia } from '@/lib/facebook/types';
import PostCard from './PostCard';

interface PostsGridProps {
  initialPosts: InstagramMedia[];
  initialNextCursor?: string;
  initialHasMore: boolean;
}

export default function PostsGrid({
  initialPosts,
  initialNextCursor,
  initialHasMore,
}: PostsGridProps) {
  const [posts, setPosts] = useState<InstagramMedia[]>(initialPosts);
  const [nextCursor, setNextCursor] = useState<string | undefined>(initialNextCursor);
  const [hasMore, setHasMore] = useState(initialHasMore);
  const [isLoading, setIsLoading] = useState(false);

  // Intersection Observer target
  const loadMoreRef = useRef<HTMLDivElement>(null);

  const loadMorePosts = useCallback(async () => {
    if (isLoading || !hasMore) return;

    setIsLoading(true);
    try {
      const data = await getInstagramPosts(nextCursor);

      // Append new posts to existing ones
      setPosts((prev) => [...prev, ...data.posts]);
      setNextCursor(data.nextCursor);
      setHasMore(data.hasMore);
    } catch (error) {
      console.error('Failed to load more posts:', error);
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, hasMore, nextCursor]);

  // Auto-load on scroll using Intersection Observer
  useEffect(() => {
    if (!hasMore || isLoading) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          loadMorePosts();
        }
      },
      {
        threshold: 0.1,
        rootMargin: '200px', // Start loading when user is 200px away from the trigger
      }
    );

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    return () => {
      if (loadMoreRef.current) {
        observer.unobserve(loadMoreRef.current);
      }
    };
  }, [hasMore, isLoading, loadMorePosts]);

  if (posts.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">Постів не знайдено</p>
        <p className="text-gray-400 text-sm mt-2">
          Спробуйте опублікувати контент у вашому Instagram акаунті
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-3 gap-1">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>

      {/* Auto-load trigger and loading indicator */}
      {hasMore && (
        <div ref={loadMoreRef} className="flex justify-center py-8">
          {isLoading && (
            <div className="flex items-center text-gray-500">
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              <span>Завантаження постів...</span>
            </div>
          )}
        </div>
      )}

      {!hasMore && posts.length > 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500">Усі публікації завантажено</p>
        </div>
      )}
    </div>
  );
}
