'use client';

import { formatDistanceToNow } from 'date-fns';
import { uk } from 'date-fns/locale';
import { Heart, MessageCircle, RefreshCw } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import { VariableSizeList as List } from 'react-window';
import Button from '@/components/ui/Button';
import {
  getCommentsAction,
  getPostDetailsAction,
  type InstagramCommentsResult,
} from '@/lib/actions/instagram';
import type { InstagramComment, InstagramMedia } from '@/lib/facebook/types';

interface CommentsListProps {
  post: InstagramMedia;
}

interface CommentItemProps {
  index: number;
  style: React.CSSProperties;
  data: {
    comments: InstagramComment[];
    hasMore: boolean;
    loadMore: () => void;
  };
}

// Height cache for virtualization
const itemSizeCache = new Map<number, number>();

// Calculate comment height based on text length
const getCommentHeight = (comment: InstagramComment, index: number): number => {
  if (itemSizeCache.has(index)) {
    return itemSizeCache.get(index)!;
  }

  // Base height
  let height = 60; // Avatar + username + margin

  // Add height for text (roughly 20px per line, 50 chars per line)
  const textLines = Math.ceil(comment.text.length / 50);
  height += textLines * 20;

  // Add padding
  height += 20;

  itemSizeCache.set(index, height);
  return height;
};

function CommentItem({ index, style, data }: CommentItemProps) {
  const { comments, hasMore, loadMore } = data;
  const comment = comments[index];

  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  useEffect(() => {
    if (inView && hasMore && index === comments.length - 2) {
      loadMore();
    }
  }, [inView, hasMore, index, comments.length, loadMore]);

  if (!comment) {
    return (
      <div style={style} className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const formattedDate = formatDistanceToNow(new Date(comment.timestamp), {
    addSuffix: true,
    locale: uk,
  });

  return (
    <div ref={ref} style={style} className="px-4 py-3 border-b border-gray-100">
      <div className="flex space-x-3">
        <div className="flex-shrink-0">
          <div className="w-8 h-8 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center">
            <span className="text-white text-sm font-medium">
              {comment.username.charAt(0).toUpperCase()}
            </span>
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-gray-900">{comment.username}</span>
            <span className="text-xs text-gray-500">{formattedDate}</span>
          </div>
          <p className="text-sm text-gray-700 mt-1 leading-relaxed">{comment.text}</p>
          <div className="flex items-center space-x-4 mt-2">
            <button
              type="button"
              className="flex items-center space-x-1 text-xs text-gray-500 hover:text-red-500 transition-colors"
            >
              <Heart className="w-3 h-3" />
              <span>{comment.like_count}</span>
            </button>
            {comment.replies?.data && comment.replies.data.length > 0 && (
              <button
                type="button"
                className="flex items-center space-x-1 text-xs text-gray-500 hover:text-blue-500 transition-colors"
              >
                <MessageCircle className="w-3 h-3" />
                <span>{comment.replies.data.length} відповідей</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CommentsList({ post }: CommentsListProps) {
  const [postId] = useState<string>(post.id);
  const [comments, setComments] = useState<InstagramComment[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [nextCursor, setNextCursor] = useState<string | null | undefined>();
  const [totalCount, setTotalCount] = useState<number>(post.comments_count || 0);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const listRef = useRef<List>(null);

  const loadComments = useCallback(
    async (cursor?: string, append: boolean = true) => {
      try {
        setError(null);
        const result: InstagramCommentsResult = await getCommentsAction(postId, cursor);

        if (append) {
          setComments((prev) => [...prev, ...result.comments]);
        } else {
          setComments(result.comments);
        }

        setNextCursor(result.nextCursor);
        setHasMore(result.comments?.length > 0 && result.nextCursor !== null);
      } catch (err) {
        setError('Помилка завантаження коментарів');
        console.error('Error loading comments:', err);
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [postId]
  );

  const loadMore = useCallback(() => {
    if (hasMore && !loading && nextCursor) {
      loadComments(nextCursor, true);
    }
  }, [hasMore, loading, nextCursor, loadComments]);

  const refresh = useCallback(async () => {
    setRefreshing(true);
    const post = await getPostDetailsAction(postId);
    setTotalCount(post.comments_count || 0);
    itemSizeCache.clear();
    await loadComments(undefined, false);
    listRef.current?.resetAfterIndex(0);
  }, [loadComments, postId]);

  useEffect(() => {
    loadComments(undefined, false);
  }, [loadComments]);

  if (loading && comments.length === 0) {
    return <CommentsListSkeleton />;
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600 mb-4">{error}</p>
        <Button onClick={refresh} variant="outline">
          Спробувати ще раз
        </Button>
      </div>
    );
  }

  if (comments.length === 0) {
    return (
      <div className="text-center py-12">
        <MessageCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900">Коментарів поки немає</h3>
        <p className="text-gray-600">Можемо дочекатись поки хтось залишить коментар</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden h-full flex flex-col">
      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-200 bg-gray-50 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <MessageCircle className="w-5 h-5 text-gray-600" />
            <h3 className="text-lg font-medium text-gray-900">Коментарі</h3>
            {totalCount && (
              <span className="text-sm text-gray-500">({totalCount.toLocaleString()})</span>
            )}
          </div>
          <Button
            onClick={refresh}
            variant="ghost"
            size="sm"
            disabled={refreshing}
            className="flex items-center space-x-2"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            <span>Оновити</span>
          </Button>
        </div>
      </div>

      {/* Comments List */}
      <div className="flex-1 min-h-0">
        <List
          ref={listRef}
          height={400}
          width="100%"
          itemCount={comments.length}
          itemSize={(index) => getCommentHeight(comments[index], index)}
          itemData={{
            comments,
            hasMore,
            loadMore,
          }}
          overscanCount={3}
        >
          {CommentItem}
        </List>
      </div>

      {/* Loading More Indicator */}
      {hasMore && (
        <div className="px-4 py-3 text-center border-t border-gray-200 flex-shrink-0">
          <button
            type="button"
            onClick={loadMore}
            disabled={loading}
            className="text-sm text-blue-600 hover:text-blue-800 disabled:text-gray-400"
          >
            {loading ? 'Завантаження...' : 'Завантажити ще'}
          </button>
        </div>
      )}
    </div>
  );
}

function CommentsListSkeleton() {
  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden h-full flex flex-col">
      <div className="px-4 py-3 border-b border-gray-200 bg-gray-50 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-5 h-5 bg-gray-200 rounded animate-pulse"></div>
            <div className="w-24 h-6 bg-gray-200 rounded animate-pulse"></div>
          </div>
          <div className="w-16 h-8 bg-gray-200 rounded animate-pulse"></div>
        </div>
      </div>
      <div className="flex-1 min-h-0 p-4 space-y-4">
        {Array.from({ length: 6 }, (_, i) => (
          <div key={`skeleton-comment-${Date.now()}-${i}`} className="animate-pulse">
            <div className="flex space-x-3">
              <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/3"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
