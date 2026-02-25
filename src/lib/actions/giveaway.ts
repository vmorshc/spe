'use server';

import type { InstagramMedia } from '@/lib/facebook/types';
import { GiveawayEngine } from '@/lib/giveaway/engine';
import type { GiveawayListItem, GiveawayParticipant, GiveawayRecord } from '@/lib/giveaway/types';
import type { NormalizedComment } from '@/lib/instagramExport/types';
import { giveawayRepository } from '@/lib/redis/repositories/giveaway';
import { instagramExportRepository } from '@/lib/redis/repositories/instagramExport';
import { getCurrentUser } from './auth';

export interface RunGiveawayResult {
  giveawayId: string;
  winners: NormalizedComment[];
}

export async function runGiveawayAction(params: {
  exportId: string;
  media: InstagramMedia;
  winnerCount: number;
  uniqueUsers: boolean;
  uniqueWinners: boolean;
}): Promise<RunGiveawayResult> {
  const user = await getCurrentUser();
  if (!user) throw new Error('Unauthorized');

  const exportRecord = await instagramExportRepository.getExportRecord(params.exportId);
  if (!exportRecord) throw new Error('Export not found');
  if (exportRecord.owner.instagramId !== user.instagramId) {
    throw new Error('Forbidden: You do not own this export');
  }
  if (exportRecord.status !== 'done') {
    throw new Error('Export is not complete');
  }

  const totalComments = exportRecord.list.length;
  if (totalComments === 0) throw new Error('Export has no comments');

  const { items: allComments } = await instagramExportRepository.getCommentsSlice(
    params.exportId,
    0,
    totalComments
  );

  const participants: GiveawayParticipant[] = allComments.map((c) => ({
    commentId: c.commentId,
    userId: c.userId,
    username: c.username,
  }));

  const giveawayDateIso = new Date().toISOString();

  const engine = new GiveawayEngine({
    postId: params.media.id,
    postDateIso: new Date(params.media.timestamp).toISOString(),
    commentCount: exportRecord.post.commentsCountAtStart ?? totalComments,
    giveawayDateIso,
    participants,
    winnerCount: params.winnerCount,
    options: {
      uniqueUsers: params.uniqueUsers,
      uniqueWinners: params.uniqueWinners,
    },
  });

  const result = engine.run();

  const record: GiveawayRecord = {
    giveawayId: crypto.randomUUID(),
    createdAt: giveawayDateIso,
    exportId: params.exportId,
    profileId: user.instagramId,
    post: {
      mediaId: params.media.id,
      postDateIso: new Date(params.media.timestamp).toISOString(),
      permalink: params.media.permalink,
      caption: params.media.caption,
    },
    commentCount: exportRecord.post.commentsCountAtStart ?? totalComments,
    participantsHash: result.participantsHash,
    filteredParticipantCount: result.filteredParticipantCount,
    options: {
      uniqueUsers: params.uniqueUsers,
      uniqueWinners: params.uniqueWinners,
      winnerCount: params.winnerCount,
    },
    winners: result.winners,
  };

  await giveawayRepository.createGiveaway(record);

  const commentByCommentId = new Map(allComments.map((c) => [c.commentId, c]));
  const winners: NormalizedComment[] = result.winners
    .filter((w) => w.status === 'active')
    .map((w) => commentByCommentId.get(w.participant.commentId))
    .filter((c): c is NormalizedComment => c !== undefined);

  return { giveawayId: record.giveawayId, winners };
}

export async function listGiveawaysAction(
  params: { profileId?: string; postId?: string },
  offset = 0,
  limit = 20
): Promise<GiveawayListItem[]> {
  const user = await getCurrentUser();
  if (!user) throw new Error('Unauthorized');

  if (params.postId) {
    return giveawayRepository.listByPost(params.postId, offset, limit);
  }

  const profileId = params.profileId ?? user.instagramId;
  return giveawayRepository.listByProfile(profileId, offset, limit);
}

export async function getGiveawayAction(giveawayId: string): Promise<GiveawayRecord> {
  const user = await getCurrentUser();
  if (!user) throw new Error('Unauthorized');

  const record = await giveawayRepository.getGiveaway(giveawayId);
  if (!record) throw new Error('Giveaway not found');

  if (record.profileId !== user.instagramId) {
    throw new Error('Forbidden: You do not own this giveaway');
  }

  return record;
}
