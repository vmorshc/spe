'use client';

import { type ColumnDef, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { format } from 'date-fns';
import { uk } from 'date-fns/locale';
import { motion } from 'framer-motion';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import { Button } from '@/components/ui/Button';
import { Progress } from '@/components/ui/progress';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  fetchExportCommentsAction,
  getExportAction,
  resumeExportAction,
} from '@/lib/actions/instagramExport';
import { trackEvent } from '@/lib/analytics';
import { useWizard } from '@/lib/contexts/WizardContext';
import type { ExportRecord, ExportStatus, NormalizedComment } from '@/lib/instagramExport/types';

export default function Step2PreviewAndLoad() {
  const {
    exportId,
    setCanGoNext,
    setExportRecord: setWizardExportRecord,
    registerNextHandler,
    currentStep,
  } = useWizard();
  const [status, setStatus] = useState<ExportStatus>('pending');
  const [exportRecord, setExportRecord] = useState<ExportRecord | null>(null);
  const [comments, setComments] = useState<NormalizedComment[]>([]);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const loadingRef = useRef(false);
  const pollingRef = useRef<NodeJS.Timeout | null>(null);
  const exportStartTracked = useRef(false);
  const exportEndTracked = useRef(false);
  const exportStartTime = useRef(Date.now());
  const stepStartTime = useRef(Date.now());

  const { ref: sentinelRef, inView } = useInView({ threshold: 0.5 });

  const loadComments = useCallback(async () => {
    if (loadingRef.current || !hasMore || status !== 'done' || !exportId) return;
    loadingRef.current = true;
    setLoading(true);
    try {
      const result = await fetchExportCommentsAction(exportId, offset, 50);
      setComments((prev) => [...prev, ...result.items]);
      if (result.nextOffset === undefined) {
        setHasMore(false);
      } else {
        setOffset(result.nextOffset);
      }
    } catch (error) {
      console.error('Failed to load comments:', error);
    } finally {
      loadingRef.current = false;
      setLoading(false);
    }
  }, [exportId, offset, hasMore, status]);

  useEffect(() => {
    if (inView && status === 'done' && hasMore && !loading) {
      void loadComments();
    }
  }, [inView, loadComments, status, hasMore, loading]);

  useEffect(() => {
    if (!exportId) return;

    let mounted = true;

    const poll = async () => {
      try {
        const rec = await getExportAction(exportId);
        if (!mounted) return;
        setExportRecord(rec);
        setStatus(rec.status);

        if (rec.status === 'pending' || rec.status === 'running' || rec.status === 'csv_pending') {
          if (!exportStartTracked.current) {
            exportStartTracked.current = true;
            exportStartTime.current = Date.now();
            trackEvent('export_started', {
              export_id: exportId,
              post_id: rec.post.mediaId,
              expected_comments_count: rec.post.commentsCountAtStart ?? 0,
            });
          }
          await resumeExportAction(exportId, 1500);
          pollingRef.current = setTimeout(poll, 2500);
        } else if (rec.status === 'done') {
          if (!exportEndTracked.current) {
            exportEndTracked.current = true;
            trackEvent('export_completed', {
              export_id: exportId,
              comments_loaded: rec.counters.appended,
              comments_failed: rec.counters.failed,
              duplicates_count: rec.counters.skipped.duplicates,
              unique_users_count: rec.counters.uniqUsers,
              export_duration_sec: Math.round((Date.now() - exportStartTime.current) / 1000),
            });
          }
          // Update the wizard context with the final export record
          setWizardExportRecord(rec);
          void loadComments();
          setCanGoNext(true);
        }
      } catch (error) {
        console.error('Polling error:', error);
        if (mounted) {
          setStatus('failed');
          if (!exportEndTracked.current) {
            exportEndTracked.current = true;
            trackEvent('export_failed', {
              export_id: exportId,
              error_message: error instanceof Error ? error.message : 'Unknown error',
            });
          }
        }
      }
    };

    void poll();

    return () => {
      mounted = false;
      if (pollingRef.current) clearTimeout(pollingRef.current);
    };
  }, [exportId, loadComments, setCanGoNext, setWizardExportRecord]);

  const handleStep2Next = useCallback(() => {
    trackEvent('wizard_step2_completed', {
      export_id: exportId || '',
      total_comments: exportRecord?.counters.appended || 0,
      unique_users_count: exportRecord?.counters.uniqUsers || 0,
      step_duration_sec: Math.round((Date.now() - stepStartTime.current) / 1000),
    });
  }, [exportId, exportRecord]);

  useEffect(() => {
    if (currentStep === 2 && status === 'done') {
      registerNextHandler(handleStep2Next);
    }
    return () => {
      registerNextHandler(null);
    };
  }, [currentStep, status, registerNextHandler, handleStep2Next]);

  const columns: ColumnDef<NormalizedComment>[] = [
    {
      accessorKey: 'username',
      header: 'Користувач',
      cell: ({ row }) => (
        <div className="font-medium min-w-[120px]">{row.getValue('username')}</div>
      ),
    },
    {
      accessorKey: 'text',
      header: 'Коментар',
      cell: ({ row }) => (
        <div className="max-w-md min-w-[200px] truncate">{row.getValue('text')}</div>
      ),
    },
    {
      accessorKey: 'timestamp',
      header: 'Дата',
      cell: ({ row }) => {
        const timestamp = row.getValue('timestamp') as string;
        return (
          <div className="text-sm text-muted-foreground min-w-[140px] whitespace-nowrap">
            {format(new Date(timestamp), 'dd MMM yyyy, HH:mm', { locale: uk })}
          </div>
        );
      },
    },
    {
      accessorKey: 'likeCount',
      header: 'Лайки',
      cell: ({ row }) => (
        <div className="text-center min-w-[60px]">{row.getValue('likeCount')}</div>
      ),
    },
  ];

  const table = useReactTable({
    data: comments,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const progress = exportRecord
    ? Math.min(
        100,
        Math.round(
          (exportRecord.counters.appended / (exportRecord.post.commentsCountAtStart || 1)) * 100
        )
      )
    : 0;

  if (status === 'failed') {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="space-y-6"
      >
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold">Помилка експорту</h2>
          <p className="text-muted-foreground">Не вдалося завантажити коментарі</p>
        </div>
        <Button onClick={() => window.location.reload()}>Спробувати ще раз</Button>
      </motion.div>
    );
  }

  if (status === 'pending' || status === 'running' || status === 'csv_pending') {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="space-y-6"
      >
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold">Завантаження коментарів</h2>
          <p className="text-muted-foreground">Будь ласка, зачекайте...</p>
        </div>
        <div className="space-y-4">
          <Progress value={progress} />
          <div className="text-center text-sm text-muted-foreground">
            {exportRecord?.counters.appended || 0} / {exportRecord?.post.commentsCountAtStart || 0}
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col h-full"
    >
      <div className="space-y-2 mb-6 flex-shrink-0">
        <h2 className="text-2xl font-semibold">Перегляд учасників</h2>
      </div>
      <Table>
        <TableHeader className="sticky top-0 z-10 bg-background">
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(header.column.columnDef.header, header.getContext())}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                Немає даних
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      {hasMore && (
        <div ref={sentinelRef} className="py-4 text-center text-sm text-muted-foreground">
          {loading ? 'Завантаження...' : 'Прокрутіть для завантаження ще'}
        </div>
      )}
    </motion.div>
  );
}
