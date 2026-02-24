'use server';

import type { NormalizedComment } from '@/lib/instagramExport/types';
import { instagramExportRepository } from '@/lib/redis/repositories/instagramExport';
import { getCurrentUser } from './auth';

export async function pickWinnersAction(
  exportId: string,
  count: number
): Promise<NormalizedComment[]> {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error('Unauthorized');
  }

  const exportRecord = await instagramExportRepository.getExportRecord(exportId);
  if (!exportRecord) {
    throw new Error('Export not found');
  }

  if (exportRecord.owner.instagramId !== user.instagramId) {
    throw new Error('Forbidden: You do not own this export');
  }

  if (exportRecord.status !== 'done') {
    throw new Error('Export is not complete');
  }

  const totalComments = exportRecord.list.length;
  if (count < 1 || count > totalComments) {
    throw new Error(`Winner count must be between 1 and ${totalComments}`);
  }

  const { items: allComments } = await instagramExportRepository.getCommentsSlice(
    exportId,
    0,
    totalComments
  );

  const shuffled = fisherYatesShuffle([...allComments]);

  return shuffled.slice(0, count);
}

function fisherYatesShuffle<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(
      (crypto.getRandomValues(new Uint32Array(1))[0] / (0xffffffff + 1)) * (i + 1)
    );
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}
