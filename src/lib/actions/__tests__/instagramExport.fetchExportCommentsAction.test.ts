import { describe, expect, it, vi } from 'vitest';

// Mock Facebook client; used when seeding data via resumeExportAction
vi.mock('@/lib/facebook/client', () => {
  return {
    facebookClient: {
      getPostComments: vi.fn(),
    },
  };
});

describe('fetchExportCommentsAction', () => {
  it('paginates results and returns correct nextOffset values', async () => {
    // Build deterministic comments: 120 items, strictly decreasing timestamps (newest-first order)
    type TComment = {
      id: string;
      text: string;
      timestamp: string;
      like_count: number;
      username: string;
      user: { id: string; username: string };
    };
    const TOTAL = 120;
    const PAGE_SIZE = 30;
    const BASE = Date.now() - 1_000_000;
    const ALL_COMMENTS: TComment[] = Array.from({ length: TOTAL }).map((_, i) => ({
      id: `c_${i}`,
      text: `comment ${i}`,
      timestamp: new Date(BASE - i * 60_000).toISOString(),
      like_count: 0,
      username: `u_${i}`,
      user: { id: `u_${i}`, username: `u_${i}` },
    }));

    const { facebookClient } = await import('@/lib/facebook/client');
    vi.mocked(facebookClient.getPostComments).mockReset();
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
          } as unknown as { data: TComment[] };
        }
        return { data } as unknown as { data: TComment[] };
      }
    );

    const { startExportAction, resumeExportAction, fetchExportCommentsAction } = await import(
      '@/lib/actions/instagramExport'
    );

    const { exportId } = await startExportAction('post_seed_1');
    await resumeExportAction(exportId, 10_000);

    // Slice 1
    const slice1 = await fetchExportCommentsAction(exportId, 0, 50);
    expect(slice1.items.length).toBe(50);
    expect(slice1.nextOffset).toBe(50);

    // Slice 2
    const slice2 = await fetchExportCommentsAction(exportId, slice1.nextOffset!, 50);
    expect(slice2.items.length).toBe(50);
    expect(slice2.nextOffset).toBe(100);

    // Tail slice
    const slice3 = await fetchExportCommentsAction(exportId, slice2.nextOffset!, 50);
    expect(slice3.items.length).toBe(20);
    expect(slice3.nextOffset).toBeUndefined();

    // Boundary: exact end
    const exactEnd = await fetchExportCommentsAction(exportId, 100, 20);
    expect(exactEnd.items.length).toBe(20);
    expect(exactEnd.nextOffset).toBeUndefined();

    // Out-of-range offset
    const beyond = await fetchExportCommentsAction(exportId, 200, 50);
    expect(beyond.items.length).toBe(0);
    expect(beyond.nextOffset).toBeUndefined();

    // Verify overall ordering remains strictly newest-first by timestamp
    const joined = [...slice1.items, ...slice2.items, ...slice3.items];
    expect(joined.length).toBe(120);
    for (let i = 1; i < joined.length; i += 1) {
      expect(new Date(joined[i - 1].timestamp) > new Date(joined[i].timestamp)).toBe(true);
    }
  }, 120_000);

  it('throws Unauthorized when no active session', async () => {
    const { fetchExportCommentsAction } = await import('@/lib/actions/instagramExport');
    const original = process.env.__TEST_SESSION_ID;
    try {
      delete process.env.__TEST_SESSION_ID;
      await expect(fetchExportCommentsAction('any')).rejects.toThrowError('Unauthorized');
    } finally {
      if (original) process.env.__TEST_SESSION_ID = original;
    }
  }, 120_000);

  it('throws Forbidden when export belongs to another user', async () => {
    const { startExportAction, fetchExportCommentsAction } = await import(
      '@/lib/actions/instagramExport'
    );
    const { userRepository } = await import('@/lib/redis/repositories/users');

    const original = process.env.__TEST_SESSION_ID!;
    // Create a session for a different user and make it active to create the export
    const otherSessionId = await userRepository.createSession({
      instagramId: 'insta_2',
      username: 'other',
      profilePicture: '',
      followersCount: 0,
      mediaCount: 0,
      accessToken: 'token-2',
      pageId: 'page_2',
      pageName: 'page-2',
    });

    process.env.__TEST_SESSION_ID = otherSessionId;
    const { exportId } = await startExportAction('post_foreign');

    // Switch back to default user and attempt to fetch
    process.env.__TEST_SESSION_ID = original;
    await expect(fetchExportCommentsAction(exportId, 0, 10)).rejects.toThrowError('Forbidden');
  }, 120_000);

  it('throws when export is not found', async () => {
    const { fetchExportCommentsAction } = await import('@/lib/actions/instagramExport');
    await expect(fetchExportCommentsAction('nonexistent', 0, 10)).rejects.toThrowError(
      'Export not found'
    );
  }, 120_000);
});
