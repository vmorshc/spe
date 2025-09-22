import { describe, expect, it, vi } from 'vitest';

// Build a deterministic array of 1000 comments (ascending by time, oldest -> newest)
const PAGE_SIZE = 50;
type TComment = {
  id: string;
  text: string;
  timestamp: string;
  like_count: number;
  username: string;
  user: { id: string; username: string };
};
const BASE = Date.now() - 2_000_000; // some time in the past
const ALL_COMMENTS: TComment[] = Array.from({ length: 1000 }).map((_, i) => ({
  id: `c_${i}`,
  text: `comment ${i}`,
  timestamp: new Date(BASE - i * 60_000).toISOString(), // strictly decreasing for newest-first
  like_count: 0,
  username: `u_${i}`,
  user: { id: `u_${i}`, username: `u_${i}` },
}));

// Mock Facebook client; implementations are provided per-test using mockImplementation
vi.mock('@/lib/facebook/client', () => {
  return {
    facebookClient: {
      getPostComments: vi.fn(),
    },
  };
});

describe('resumeExportAction integration (Redis + real getCurrentUser)', () => {
  it('collects 1000 comments in correct order and finalizes export', async () => {
    const { facebookClient } = await import('@/lib/facebook/client');
    vi.mocked(facebookClient.getPostComments).mockReset();
    // Cursor format: undefined -> page 0, then 'p_<n>' for page index n
    vi.mocked(facebookClient.getPostComments).mockImplementation(
      async (_postId: string, _token: string, after?: string) => {
        const pageIdx = after ? Number(after.split('_')[1]) : 0;
        const start = pageIdx * PAGE_SIZE;
        const end = Math.min(start + PAGE_SIZE, ALL_COMMENTS.length);
        const data = ALL_COMMENTS.slice(start, end);
        const hasNext = end < ALL_COMMENTS.length;
        if (hasNext) {
          return {
            data,
            paging: { cursors: { before: `b_${pageIdx}`, after: `p_${pageIdx + 1}` } },
          };
        }
        return { data } as unknown as { data: TComment[] };
      }
    );

    const { startExportAction, resumeExportAction } = await import('@/lib/actions/instagramExport');
    const { instagramExportRepository } = await import('@/lib/redis/repositories/instagramExport');

    const { exportId } = await startExportAction('post_1');
    const record = await resumeExportAction(exportId, 15_000);

    expect(record.status).toBe('done');
    expect(record.finishedAt).toBeTruthy();

    const length = await instagramExportRepository.getCommentsCount(exportId);
    expect(length).toBe(1000);
    expect(record.list.length).toBe(1000);

    // Read back all comments in chunks and verify chronological order
    let offset = 0;
    const all: Array<{ timestamp: string }> = [];
    while (true) {
      const { items, nextOffset } = await instagramExportRepository.getCommentsSlice(
        exportId,
        offset,
        250
      );
      all.push(...items);
      if (nextOffset === undefined) break;
      offset = nextOffset;
    }
    expect(all.length).toBe(1000);
    for (let i = 1; i < all.length; i += 1) {
      expect(new Date(all[i - 1].timestamp) > new Date(all[i].timestamp)).toBe(true);
    }

    // Counters
    expect(record.counters.appended).toBe(1000);
    expect(record.counters.skipped.duplicates).toBe(0);
    expect(record.counters.skipped.byAuthor).toBe(0);
  }, 120_000);

  it('skips duplicate comments by commentId across pages', async () => {
    const { facebookClient } = await import('@/lib/facebook/client');
    vi.mocked(facebookClient.getPostComments).mockReset();

    // Build duplicate scenario: two pages, second duplicates the first
    const DUP_PAGE_SIZE = 20;
    const NOW = Date.now();
    const page1: TComment[] = Array.from({ length: DUP_PAGE_SIZE }).map((_, i) => ({
      id: `c_${i}`,
      text: `comment ${i}`,
      timestamp: new Date(NOW - i * 60_000).toISOString(),
      like_count: 0,
      username: `u_${i}`,
      user: { id: `u_${i}`, username: `u_${i}` },
    }));
    const page2: TComment[] = page1.map((c) => ({ ...c }));

    vi.mocked(facebookClient.getPostComments).mockImplementation(
      async (_postId: string, _token: string, after?: string) => {
        if (!after) {
          return { data: page1, paging: { cursors: { before: 'b_1', after: 'p_2' } } };
        }
        return { data: page2 } as unknown as { data: TComment[] };
      }
    );

    const { startExportAction, resumeExportAction } = await import('@/lib/actions/instagramExport');
    const { instagramExportRepository } = await import('@/lib/redis/repositories/instagramExport');

    const { exportId } = await startExportAction('post_dup_1');
    const record = await resumeExportAction(exportId, 10_000);

    expect(record.status).toBe('done');
    expect(record.finishedAt).toBeTruthy();

    const length = await instagramExportRepository.getCommentsCount(exportId);
    expect(length).toBe(DUP_PAGE_SIZE);
    expect(record.list.length).toBe(DUP_PAGE_SIZE);

    expect(record.counters.appended).toBe(DUP_PAGE_SIZE);
    expect(record.counters.skipped.duplicates).toBe(DUP_PAGE_SIZE);
    expect(record.counters.skipped.byAuthor).toBe(0);
  }, 120_000);
});
