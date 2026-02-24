'use client';

import { formatDistanceToNow } from 'date-fns';
import { uk } from 'date-fns/locale';
import { Heart, MessageCircle } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import ExportProgressModal from '@/components/instagram/ExportProgressModal';
import { Button } from '@/components/ui/Button';
import { fetchExportCommentsAction } from '@/lib/actions/instagramExport';
import type { ExportRecord } from '@/lib/instagramExport/types';

interface Props {
  exportRecord: ExportRecord;
}

interface NormalizedComment {
  commentId: string;
  userId: string;
  username: string;
  timestamp: string;
  likeCount: number;
  parentCommentId: string | null;
  text: string;
}

export default function ExportCommentsList({ exportRecord }: Props) {
  const [items, setItems] = useState<NormalizedComment[]>([]);
  const [offset, setOffset] = useState<number>(0);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isExportDone, setIsExportDone] = useState<boolean>(exportRecord.status === 'done');
  const [exportFailed, setExportFailed] = useState<boolean>(exportRecord.status === 'failed');
  const loadingRef = useRef<boolean>(false);

  const { ref, inView } = useInView({ rootMargin: '200px' });

  const loadMore = useCallback(async () => {
    if (loadingRef.current || !isExportDone || !hasMore) return;
    loadingRef.current = true;
    setLoading(true);
    try {
      const res = await fetchExportCommentsAction(exportRecord.exportId, offset, 50);
      setItems((prev) => prev.concat(res.items));
      if (res.nextOffset === undefined) {
        setHasMore(false);
      } else {
        setOffset(res.nextOffset);
      }
    } catch (_e) {
      setError('Помилка завантаження коментарів');
    } finally {
      loadingRef.current = false;
      setLoading(false);
    }
  }, [exportRecord.exportId, offset, isExportDone, hasMore]);

  // Reset state on export change (server provided record)
  useEffect(() => {
    let mounted = true;
    (async () => {
      // reset local state when export changes
      setItems([]);
      setOffset(0);
      setHasMore(true);
      setLoading(false);
      setError(null);
      if (!mounted) return;
      setIsExportDone(exportRecord.status === 'done');
      setExportFailed(exportRecord.status === 'failed');
    })();
    return () => {
      mounted = false;
    };
  }, [exportRecord.status]);

  // Infinite scroll trigger
  useEffect(() => {
    if (inView && !loading && hasMore && isExportDone && !loadingRef.current) {
      void loadMore();
    }
  }, [inView, loadMore, loading, hasMore, isExportDone]);

  // Kick off initial load once export is done or on page refresh when already done
  useEffect(() => {
    if (isExportDone && items.length === 0 && !loading && !loadingRef.current) {
      void loadMore();
    }
  }, [isExportDone, items.length, loading, loadMore]);

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600 mb-4">{error}</p>
        <Button onClick={() => location.reload()} variant="outline">
          Спробувати ще раз
        </Button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      {!isExportDone && !exportFailed && (
        <ExportProgressModal
          exportId={exportRecord.exportId}
          initialStatus={exportRecord.status}
          onDone={() => {
            setIsExportDone(true);
            // kick off first page load immediately
            void loadMore();
          }}
          onFail={() => {
            setExportFailed(true);
          }}
        />
      )}
      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <MessageCircle className="w-5 h-5 text-gray-600" />
          <h3 className="text-lg font-medium text-gray-900">
            Коментарі{' '}
            {exportRecord.createdAt
              ? new Date(exportRecord.createdAt).toLocaleString()
              : 'не визначено'}
          </h3>
        </div>
        {!isExportDone && (
          <div className="text-sm text-gray-600">
            {exportFailed ? 'Помилка експорту' : 'Експорт триває…'}
          </div>
        )}
      </div>

      {/* List */}
      <ul className="divide-y divide-gray-100">
        {items.map((c) => {
          const formattedDate = formatDistanceToNow(new Date(c.timestamp), {
            addSuffix: true,
            locale: uk,
          });
          return (
            <li key={c.commentId} className="px-4 py-3">
              <div className="flex space-x-3">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-medium">
                      {c.username.charAt(0).toUpperCase()}
                    </span>
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium text-gray-900">{c.username}</span>
                    <span className="text-xs text-gray-500">{formattedDate}</span>
                  </div>
                  <p className="text-sm text-gray-700 mt-1 leading-relaxed">{c.text}</p>
                  <div className="flex items-center space-x-4 mt-2">
                    <span className="flex items-center space-x-1 text-xs text-gray-500">
                      <Heart className="w-3 h-3" />
                      <span>{c.likeCount}</span>
                    </span>
                  </div>
                </div>
              </div>
            </li>
          );
        })}
      </ul>

      {/* Sentinel */}
      <div ref={ref} className="py-4 text-center text-sm text-gray-500">
        {loading
          ? 'Завантаження…'
          : hasMore
            ? 'Прокрутіть, щоб завантажити ще'
            : 'Більше немає даних'}
      </div>
    </div>
  );
}
