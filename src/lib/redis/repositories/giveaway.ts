import type { GiveawayListItem, GiveawayRecord } from '@/lib/giveaway/types';
import { BaseRedisRepository } from './base';

export class GiveawayRepository extends BaseRedisRepository {
  private readonly RECORD_TTL_SECONDS = 30 * 24 * 60 * 60; // 30d
  private readonly INDEX_TTL_SECONDS = 30 * 24 * 60 * 60; // 30d

  constructor() {
    super('giveaway');
  }

  private recordKey(giveawayId: string): string {
    return this.getKey(giveawayId);
  }

  private postIndexKey(mediaId: string): string {
    return this.getKey(`index:post:${mediaId}`);
  }

  private profileIndexKey(instagramId: string): string {
    return this.getKey(`index:profile:${instagramId}`);
  }

  async createGiveaway(record: GiveawayRecord): Promise<void> {
    if (!this.client) return;

    const key = this.recordKey(record.giveawayId);
    await this.client.set(key, JSON.stringify(record));
    await this.client.expire(key, this.RECORD_TTL_SECONDS);

    const epoch = new Date(record.createdAt).getTime();

    const postKey = this.postIndexKey(record.post.mediaId);
    await this.client.zadd(postKey, epoch, record.giveawayId);
    await this.client.expire(postKey, this.INDEX_TTL_SECONDS);

    const profileKey = this.profileIndexKey(record.profileId);
    await this.client.zadd(profileKey, epoch, record.giveawayId);
    await this.client.expire(profileKey, this.INDEX_TTL_SECONDS);
  }

  async getGiveaway(giveawayId: string): Promise<GiveawayRecord | null> {
    if (!this.client) return null;
    const json = await this.client.get(this.recordKey(giveawayId));
    if (!json) return null;
    return JSON.parse(json) as GiveawayRecord;
  }

  async listByPost(mediaId: string, offset: number, limit: number): Promise<GiveawayListItem[]> {
    return this.listFromIndex(this.postIndexKey(mediaId), offset, limit);
  }

  async listByProfile(
    instagramId: string,
    offset: number,
    limit: number
  ): Promise<GiveawayListItem[]> {
    return this.listFromIndex(this.profileIndexKey(instagramId), offset, limit);
  }

  private async listFromIndex(
    indexKey: string,
    offset: number,
    limit: number
  ): Promise<GiveawayListItem[]> {
    if (!this.client) return [];
    const ids = await this.client.zrevrange(indexKey, offset, offset + limit - 1);
    const results: GiveawayListItem[] = [];
    for (const id of ids) {
      const rec = await this.getGiveaway(id);
      if (rec) {
        results.push({
          giveawayId: rec.giveawayId,
          createdAt: rec.createdAt,
          post: { mediaId: rec.post.mediaId, permalink: rec.post.permalink },
          options: { winnerCount: rec.options.winnerCount },
          activeWinnerCount: rec.winners.filter((w) => w.status === 'active').length,
        });
      }
    }
    return results;
  }
}

export const giveawayRepository = new GiveawayRepository();
