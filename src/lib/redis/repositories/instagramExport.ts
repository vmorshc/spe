import type { ExportListItem, ExportRecord, NormalizedComment } from '@/lib/instagramExport/types';
import { BaseRedisRepository } from './base';

export class InstagramExportRepository extends BaseRedisRepository {
  private readonly LIST_TTL_SECONDS = 3 * 24 * 60 * 60; // 3d
  private readonly RECORD_TTL_SECONDS = 7 * 24 * 60 * 60; // 7d
  private readonly INDEX_TTL_SECONDS = 14 * 24 * 60 * 60; // 14d

  constructor() {
    super('igexp');
  }

  private recordKey(exportId: string): string {
    return this.getKey(exportId);
  }

  private listKey(exportId: string): string {
    return this.getKey(`${exportId}:comments`);
  }

  public buildListKey(exportId: string): string {
    return this.listKey(exportId);
  }

  private dedupeCommentsKey(exportId: string): string {
    return this.getKey(`${exportId}:dedupe:comments`);
  }

  private postIndexKey(mediaId: string): string {
    return this.getKey(`index:media:${mediaId}`);
  }

  private userIndexKey(instagramId: string): string {
    return this.getKey(`index:user:${instagramId}`);
  }

  async createExportRecord(record: ExportRecord): Promise<void> {
    if (!this.client) return;
    const key = this.recordKey(record.exportId);
    await this.client.set(key, JSON.stringify(record));
    await this.client.expire(key, this.RECORD_TTL_SECONDS);
  }

  async getExportRecord(exportId: string): Promise<ExportRecord | null> {
    if (!this.client) return null;
    const key = this.recordKey(exportId);
    const json = await this.client.get(key);
    if (!json) return null;
    return JSON.parse(json) as ExportRecord;
  }

  async updateExportRecord(exportId: string, partial: Partial<ExportRecord>): Promise<void> {
    if (!this.client) return;
    const current = await this.getExportRecord(exportId);
    if (!current) return;
    const updated: ExportRecord = { ...current, ...partial } as ExportRecord;
    await this.client.set(this.recordKey(exportId), JSON.stringify(updated));
    await this.client.expire(this.recordKey(exportId), this.RECORD_TTL_SECONDS);
  }

  async appendComments(
    exportId: string,
    comments: NormalizedComment[]
  ): Promise<{ appended: number; skippedDuplicates: number }> {
    if (!this.client) return { appended: 0, skippedDuplicates: 0 };
    const listKey = this.listKey(exportId);
    const dedupeComments = this.dedupeCommentsKey(exportId);

    let appended = 0;
    let skippedDuplicates = 0;

    for (const c of comments) {
      const wasAddedComment = await this.client.sadd(dedupeComments, c.commentId);
      if (wasAddedComment === 0) {
        skippedDuplicates += 1;
        continue;
      }

      await this.client.rpush(listKey, JSON.stringify(c));
      appended += 1;
    }

    await this.client.expire(listKey, this.LIST_TTL_SECONDS);
    await this.client.expire(dedupeComments, this.LIST_TTL_SECONDS);

    return { appended, skippedDuplicates };
  }

  async getCommentsSlice(
    exportId: string,
    offset: number,
    limit: number
  ): Promise<{ items: NormalizedComment[]; nextOffset?: number }> {
    if (!this.client) return { items: [] };
    const listKey = this.listKey(exportId);
    const end = offset + limit - 1;
    const raw = await this.client.lrange(listKey, offset, end);
    const items = raw.map((s) => JSON.parse(s) as NormalizedComment);
    const length = await this.client.llen(listKey);
    const nextOffset = end + 1 < length ? end + 1 : undefined;
    return { items, nextOffset };
  }

  async getCommentsCount(exportId: string): Promise<number> {
    if (!this.client) return 0;
    return await this.client.llen(this.listKey(exportId));
  }

  async addToPostIndex(mediaId: string, exportId: string, createdAtEpoch: number): Promise<void> {
    if (!this.client) return;
    const key = this.postIndexKey(mediaId);
    await this.client.zadd(key, createdAtEpoch, exportId);
    await this.client.expire(key, this.INDEX_TTL_SECONDS);
  }

  async listExportsByMedia(
    mediaId: string,
    offset: number,
    limit: number
  ): Promise<ExportListItem[]> {
    if (!this.client) return [];
    const key = this.postIndexKey(mediaId);
    const ids = await this.client.zrevrange(key, offset, offset + limit - 1);
    const results: ExportListItem[] = [];
    for (const id of ids) {
      const rec = await this.getExportRecord(id);
      if (rec) {
        results.push({
          exportId: rec.exportId,
          createdAt: rec.createdAt,
          status: rec.status,
          counters: { appended: rec.counters.appended },
        });
      }
    }
    return results;
  }

  async addToUserIndex(
    instagramId: string,
    exportId: string,
    createdAtEpoch: number
  ): Promise<void> {
    if (!this.client) return;
    const key = this.userIndexKey(instagramId);
    await this.client.zadd(key, createdAtEpoch, exportId);
    await this.client.expire(key, this.INDEX_TTL_SECONDS);
  }
}

export const instagramExportRepository = new InstagramExportRepository();
