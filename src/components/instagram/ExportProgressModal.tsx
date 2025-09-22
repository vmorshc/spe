'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Button from '@/components/ui/Button';
import { getExportAction, resumeExportAction } from '@/lib/actions/instagramExport';

type ExportStatus = 'pending' | 'running' | 'csv_pending' | 'done' | 'failed' | null;

interface Props {
  exportId: string;
  initialStatus?: ExportStatus;
  onDone: () => void;
  onFail?: (errorMessage?: string) => void;
}

export default function ExportProgressModal({ exportId, initialStatus, onDone, onFail }: Props) {
  const [status, setStatus] = useState<ExportStatus>(initialStatus ?? null);
  const [error, setError] = useState<string | null>(null);
  const pollingRef = useRef<NodeJS.Timeout | null>(null);
  const loadingRef = useRef<boolean>(false);
  const [expectedCount, setExpectedCount] = useState<number | null>(null);
  const [appendedCount, setAppendedCount] = useState<number>(0);

  const startPolling = useCallback(() => {
    if (pollingRef.current) return;
    const tick = async () => {
      if (loadingRef.current) return;
      loadingRef.current = true;
      try {
        const rec = await resumeExportAction(exportId, 1500);
        setStatus(rec.status);
        setExpectedCount(
          typeof rec.post.commentsCountAtStart === 'number' ? rec.post.commentsCountAtStart : null
        );
        setAppendedCount(typeof rec.counters.appended === 'number' ? rec.counters.appended : 0);
      } catch {
        setStatus('failed');
        setError('Сталася помилка під час експорту');
      } finally {
        loadingRef.current = false;
      }
    };
    // run immediately
    void tick();
    pollingRef.current = setInterval(tick, 2500);
  }, [exportId]);

  const stopPolling = useCallback(() => {
    if (pollingRef.current) clearInterval(pollingRef.current);
    pollingRef.current = null;
  }, []);

  // Initialize status if not provided
  useEffect(() => {
    let mounted = true;
    (async () => {
      if (status !== null) return;
      try {
        const rec = await getExportAction(exportId);
        if (!mounted) return;
        setStatus(rec.status);
        setExpectedCount(
          typeof rec.post.commentsCountAtStart === 'number' ? rec.post.commentsCountAtStart : null
        );
        setAppendedCount(typeof rec.counters.appended === 'number' ? rec.counters.appended : 0);
      } catch {
        setStatus('failed');
        setError('Не вдалося отримати стан експорту');
      }
    })();
    return () => {
      mounted = false;
    };
  }, [exportId, status]);

  // React to status changes
  useEffect(() => {
    if (status === 'done') {
      stopPolling();
      onDone();
      return;
    }
    if (status === 'failed') {
      stopPolling();
      onFail?.(error ?? undefined);
      return;
    }
    if (status === 'pending' || status === 'running' || status === 'csv_pending') {
      startPolling();
      return;
    }
  }, [status, onDone, onFail, error, startPolling, stopPolling]);

  useEffect(() => {
    return () => {
      stopPolling();
    };
  }, [stopPolling]);

  const handleRetry = () => {
    setError(null);
    setStatus('pending');
  };

  const percent = (() => {
    if (expectedCount === null || expectedCount <= 0) return null;
    const raw = Math.min(100, Math.round((appendedCount / expectedCount) * 100));
    return Number.isFinite(raw) ? raw : null;
  })();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" />
      <div className="relative bg-white rounded-lg shadow-lg w-full max-w-md mx-4 p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-2">Експорт коментарів</h3>
        {status !== 'failed' ? (
          <>
            <p className="text-sm text-gray-700 mb-4">
              Будь ласка, зачекайте. Триває експорт ваших коментарів…
            </p>
            {percent !== null && (
              <div className="mb-4">
                <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-2 bg-blue-500" style={{ width: `${percent}%` }} />
                </div>
                <div className="mt-1 text-xs text-gray-600">
                  {appendedCount} / {expectedCount}
                </div>
              </div>
            )}
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <span className="inline-flex h-2 w-2 animate-pulse rounded-full bg-blue-500" />
              <span>
                Стан:{' '}
                {status === 'csv_pending'
                  ? 'підготовка CSV'
                  : status === 'running'
                    ? 'в процесі'
                    : 'очікування'}
              </span>
            </div>
          </>
        ) : (
          <>
            <p className="text-sm text-red-600 mb-4">
              {error ?? 'Сталася помилка під час експорту'}
            </p>
            <div className="flex justify-end">
              <Button onClick={handleRetry}>Спробувати ще раз</Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
