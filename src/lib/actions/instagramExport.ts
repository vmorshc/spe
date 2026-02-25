'use server';

import { facebookClient } from '@/lib/facebook/client';
import type { InstagramComment } from '@/lib/facebook/types';
import type { ExportRecord, NormalizedComment } from '@/lib/instagramExport/types';
import { instagramExportRepository } from '@/lib/redis/repositories/instagramExport';
import { getCurrentUser } from './auth';

const HARD_CAP = 5000;

function normalizeComments(batch: InstagramComment[]): NormalizedComment[] {
  return batch.map((c) => ({
    commentId: c.id,
    userId: c.user?.id || c.username,
    username: c.user?.username || c.username,
    timestamp: new Date(c.timestamp).toISOString(),
    likeCount: typeof c.like_count === 'number' ? c.like_count : 0,
    parentCommentId: null,
    text: c.text || '',
  }));
}

export async function startExportAction(mediaId: string): Promise<{ exportId: string }> {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error('Unauthorized');
  }

  const exportId = crypto.randomUUID();
  const now = new Date().toISOString();
  const record: ExportRecord = {
    exportId,
    createdAt: now,
    startedAt: null,
    finishedAt: null,
    status: 'pending',
    owner: { instagramId: user.instagramId, username: user.username },
    post: { mediaId },
    igPaging: { afterCursor: null },
    counters: { appended: 0, failed: 0, skipped: { duplicates: 0 }, uniqUsers: 0 },
    list: { key: instagramExportRepository.buildListKey(exportId), length: 0 },
    file: null,
    error: null,
  };

  await instagramExportRepository.createExportRecord(record);
  const createdAtEpoch = Math.floor(Date.now() / 1000);
  await instagramExportRepository.addToPostIndex(mediaId, exportId, createdAtEpoch);
  await instagramExportRepository.addToUserIndex(user.instagramId, exportId, createdAtEpoch);

  return { exportId };
}

export async function getExportAction(exportId: string): Promise<ExportRecord> {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error('Unauthorized');
  }
  const rec = await instagramExportRepository.getExportRecord(exportId);
  if (!rec) {
    throw new Error('Export not found');
  }
  if (rec.owner.instagramId !== user.instagramId) {
    throw new Error('Forbidden');
  }
  // update live length
  const len = await instagramExportRepository.getCommentsCount(exportId);
  if (rec.list.length !== len) {
    await instagramExportRepository.updateExportRecord(exportId, {
      list: { ...rec.list, length: len },
    });
    rec.list.length = len;
  }
  return rec;
}

export async function listExportsByMediaAction(mediaId: string, offset = 0, limit = 10) {
  const user = await getCurrentUser();
  if (!user) throw new Error('Unauthorized');
  return await instagramExportRepository.listExportsByMedia(mediaId, offset, limit);
}

export async function fetchExportCommentsAction(exportId: string, offset = 0, limit = 50) {
  const user = await getCurrentUser();
  if (!user) throw new Error('Unauthorized');
  const rec = await instagramExportRepository.getExportRecord(exportId);
  if (!rec) throw new Error('Export not found');
  if (rec.owner.instagramId !== user.instagramId) throw new Error('Forbidden');
  return await instagramExportRepository.getCommentsSlice(exportId, offset, limit);
}

export async function resumeExportAction(exportId: string, budgetMs = 1500): Promise<ExportRecord> {
  const user = await getCurrentUser();
  if (!user) throw new Error('Unauthorized');

  const rec = await instagramExportRepository.getExportRecord(exportId);
  if (!rec) throw new Error('Export not found');
  if (rec.owner.instagramId !== user.instagramId) throw new Error('Forbidden');

  const record = rec;
  const startedAt = record.startedAt ?? new Date().toISOString();
  if (record.status === 'pending') {
    await instagramExportRepository.updateExportRecord(exportId, { status: 'running', startedAt });
    record.status = 'running';
    record.startedAt = startedAt;
  }

  const deadline = Date.now() + budgetMs;

  try {
    if (record.status === 'running') {
      let after: string | undefined = record.igPaging.afterCursor ?? undefined;
      while (Date.now() < deadline) {
        if (record.counters.appended >= HARD_CAP) break;
        const data = await facebookClient.getPostComments(
          record.post.mediaId,
          user.accessToken,
          after
        );
        const normalized = normalizeComments(data.data);

        const remaining = HARD_CAP - record.counters.appended;
        const slice = normalized.slice(0, Math.max(0, remaining));
        const res = await instagramExportRepository.appendComments(exportId, slice);

        record.counters.appended += res.appended;
        record.counters.skipped.duplicates += res.skippedDuplicates;
        const newLen = await instagramExportRepository.getCommentsCount(exportId);
        record.list.length = newLen;

        for (const c of slice) {
          await instagramExportRepository.countUniqUsers(exportId, c.userId);
        }
        record.counters.uniqUsers = await instagramExportRepository.countUniqUsers(exportId);

        // Update paging cursor
        after = data.paging?.cursors?.after;
        record.igPaging.afterCursor = after ?? null;

        await instagramExportRepository.updateExportRecord(exportId, {
          counters: record.counters,
          list: record.list,
          igPaging: record.igPaging,
        });

        const noNext = !data.paging?.cursors?.after;
        if (noNext || record.counters.appended >= HARD_CAP) {
          record.status = 'csv_pending';
          await instagramExportRepository.updateExportRecord(exportId, { status: 'csv_pending' });
          break;
        }
      }
    }

    // Build CSV on demand in API route; mark done immediately for MVP
    if (record.status === 'csv_pending') {
      record.status = 'done';
      record.finishedAt = new Date().toISOString();
      await instagramExportRepository.updateExportRecord(exportId, {
        status: 'done',
        finishedAt: record.finishedAt,
      });
    }

    return record;
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    await instagramExportRepository.updateExportRecord(exportId, {
      status: 'failed',
      error: { code: 'EXPORT_FAILED', message },
    });
    throw error;
  }
}
