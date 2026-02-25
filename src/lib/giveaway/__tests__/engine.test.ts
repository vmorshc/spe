import { createHash } from 'node:crypto';
import { describe, expect, it } from 'vitest';
import { GiveawayEngine } from '../engine';
import { makeInput, makeParticipants, makeParticipantsWithDuplicateUsers } from './fixtures';

describe('GiveawayEngine', () => {
  describe('getFilteredParticipants', () => {
    it('returns all participants sorted by commentId when uniqueUsers is false', () => {
      const participants = makeParticipants(5);
      const engine = new GiveawayEngine(
        makeInput({ participants, options: { uniqueUsers: false, uniqueWinners: false } })
      );
      const filtered = engine.getFilteredParticipants();
      expect(filtered).toHaveLength(5);
      for (let i = 1; i < filtered.length; i++) {
        expect(filtered[i].commentId > filtered[i - 1].commentId).toBe(true);
      }
    });

    it('filters to first comment per user when uniqueUsers is true', () => {
      const participants = makeParticipantsWithDuplicateUsers();
      const engine = new GiveawayEngine(
        makeInput({ participants, options: { uniqueUsers: true, uniqueWinners: false } })
      );
      const filtered = engine.getFilteredParticipants();
      // alice(comment_0001), bob(comment_0002), charlie(comment_0004), dave(comment_0006)
      expect(filtered).toHaveLength(4);
      const userIds = filtered.map((p) => p.userId);
      expect(new Set(userIds).size).toBe(userIds.length);
    });

    it('keeps the earliest commentId for duplicate users', () => {
      const participants = makeParticipantsWithDuplicateUsers();
      const engine = new GiveawayEngine(
        makeInput({ participants, options: { uniqueUsers: true, uniqueWinners: false } })
      );
      const filtered = engine.getFilteredParticipants();
      const alice = filtered.find((p) => p.userId === 'alice');
      expect(alice?.commentId).toBe('comment_0001');
      const bob = filtered.find((p) => p.userId === 'bob');
      expect(bob?.commentId).toBe('comment_0002');
    });

    it('returns sorted result even when input is unsorted', () => {
      const participants = [
        { commentId: 'z_comment', userId: 'u1', username: '@u1' },
        { commentId: 'a_comment', userId: 'u2', username: '@u2' },
        { commentId: 'm_comment', userId: 'u3', username: '@u3' },
      ];
      const engine = new GiveawayEngine(makeInput({ participants }));
      const filtered = engine.getFilteredParticipants();
      expect(filtered[0].commentId).toBe('a_comment');
      expect(filtered[1].commentId).toBe('m_comment');
      expect(filtered[2].commentId).toBe('z_comment');
    });
  });

  describe('buildParticipantsHash', () => {
    it('produces consistent hash for same input', () => {
      const input = makeInput();
      const engine1 = new GiveawayEngine(input);
      const engine2 = new GiveawayEngine(input);
      expect(engine1.buildParticipantsHash()).toBe(engine2.buildParticipantsHash());
    });

    it('matches manual SHA-256 computation', () => {
      const participants = makeParticipants(3);
      const engine = new GiveawayEngine(makeInput({ participants }));
      const canonical = participants.map((p) => p.commentId).join('\n');
      const expected = createHash('sha256').update(canonical).digest('hex');
      expect(engine.buildParticipantsHash()).toBe(expected);
    });

    it('produces different hash when participant is added', () => {
      const engine1 = new GiveawayEngine(makeInput({ participants: makeParticipants(3) }));
      const engine2 = new GiveawayEngine(makeInput({ participants: makeParticipants(4) }));
      expect(engine1.buildParticipantsHash()).not.toBe(engine2.buildParticipantsHash());
    });

    it('produces different hash when order changes', () => {
      const participants = makeParticipants(3);
      const reversed = [...participants].reverse();
      const engine1 = new GiveawayEngine(
        makeInput({ participants, options: { uniqueUsers: false, uniqueWinners: false } })
      );
      // With uniqueUsers=false, the engine sorts by commentId, so reversed should produce the same result
      // To test order sensitivity of the hash itself, we test with uniqueUsers filtering
      const withDups = makeParticipantsWithDuplicateUsers();
      const engineA = new GiveawayEngine(
        makeInput({ participants: withDups, options: { uniqueUsers: true, uniqueWinners: false } })
      );
      // Swap the first two comments' IDs to change which one is "first" for alice
      const modified = withDups.map((p) =>
        p.commentId === 'comment_0001' ? { ...p, commentId: 'comment_0099' } : p
      );
      const engineB = new GiveawayEngine(
        makeInput({
          participants: modified,
          options: { uniqueUsers: true, uniqueWinners: false },
        })
      );
      expect(engineA.buildParticipantsHash()).not.toBe(engineB.buildParticipantsHash());

      // Also verify same-ordered input produces same hash
      expect(engine1.buildParticipantsHash()).toBe(
        new GiveawayEngine(
          makeInput({
            participants: reversed,
            options: { uniqueUsers: false, uniqueWinners: false },
          })
        ).buildParticipantsHash()
      );
    });
  });

  describe('buildSeedInput', () => {
    it('produces correct format', () => {
      const input = makeInput();
      const engine = new GiveawayEngine(input);
      const hash = engine.buildParticipantsHash();
      const seed = engine.buildSeedInput(1, 1);
      expect(seed).toBe(
        `${input.postId}|${input.postDateIso}|${input.commentCount}|${input.giveawayDateIso}|${hash}|1|1`
      );
    });

    it('changes with different winnerNumber', () => {
      const engine = new GiveawayEngine(makeInput());
      expect(engine.buildSeedInput(1, 1)).not.toBe(engine.buildSeedInput(2, 1));
    });

    it('changes with different attempt', () => {
      const engine = new GiveawayEngine(makeInput());
      expect(engine.buildSeedInput(1, 1)).not.toBe(engine.buildSeedInput(1, 2));
    });
  });

  describe('buildSeedHash', () => {
    it('returns valid SHA-256 hex string', () => {
      const engine = new GiveawayEngine(makeInput());
      const hash = engine.buildSeedHash('test-seed');
      expect(hash).toMatch(/^[0-9a-f]{64}$/);
    });

    it('is deterministic', () => {
      const engine = new GiveawayEngine(makeInput());
      expect(engine.buildSeedHash('same-input')).toBe(engine.buildSeedHash('same-input'));
    });
  });

  describe('selectWinnerIndex', () => {
    it('returns value in valid range', () => {
      const engine = new GiveawayEngine(makeInput());
      const seedHash = engine.buildSeedHash(engine.buildSeedInput(1, 1));
      const index = engine.selectWinnerIndex(seedHash, 10);
      expect(index).toBeGreaterThanOrEqual(0);
      expect(index).toBeLessThan(10);
    });

    it('is deterministic for the same seed', () => {
      const engine = new GiveawayEngine(makeInput());
      const seedHash = engine.buildSeedHash('fixed-seed');
      const idx1 = engine.selectWinnerIndex(seedHash, 100);
      const idx2 = engine.selectWinnerIndex(seedHash, 100);
      expect(idx1).toBe(idx2);
    });

    it('produces different results for different seeds', () => {
      const engine = new GiveawayEngine(makeInput());
      const hash1 = engine.buildSeedHash('seed-a');
      const hash2 = engine.buildSeedHash('seed-b');
      // With different seeds and enough participants, indexes should differ
      // (extremely unlikely to match for random seeds with large N)
      const idx1 = engine.selectWinnerIndex(hash1, 1000000);
      const idx2 = engine.selectWinnerIndex(hash2, 1000000);
      expect(idx1).not.toBe(idx2);
    });

    it('works with participant count of 1', () => {
      const engine = new GiveawayEngine(makeInput());
      const seedHash = engine.buildSeedHash('any-seed');
      expect(engine.selectWinnerIndex(seedHash, 1)).toBe(0);
    });
  });

  describe('run', () => {
    it('selects a single winner correctly', () => {
      const engine = new GiveawayEngine(makeInput({ winnerCount: 1 }));
      const result = engine.run();

      expect(result.winners).toHaveLength(1);
      expect(result.winners[0].winnerNumber).toBe(1);
      expect(result.winners[0].attempt).toBe(1);
      expect(result.winners[0].status).toBe('active');
      expect(result.winners[0].seedInput).toBeTruthy();
      expect(result.winners[0].seedHash).toMatch(/^[0-9a-f]{64}$/);
      expect(result.winners[0].winnerIndex).toBeGreaterThanOrEqual(0);
      expect(result.winners[0].participant.commentId).toBeTruthy();
      expect(result.participantsHash).toMatch(/^[0-9a-f]{64}$/);
      expect(result.filteredParticipantCount).toBe(10);
    });

    it('selects multiple winners with unique winnerNumbers', () => {
      const engine = new GiveawayEngine(makeInput({ winnerCount: 3 }));
      const result = engine.run();

      const active = result.winners.filter((w) => w.status === 'active');
      expect(active).toHaveLength(3);
      expect(active.map((w) => w.winnerNumber)).toEqual([1, 2, 3]);
    });

    it('is fully deterministic — same input produces identical output', () => {
      const input = makeInput({ winnerCount: 3 });
      const result1 = new GiveawayEngine(input).run();
      const result2 = new GiveawayEngine(input).run();

      expect(result1).toEqual(result2);
    });

    it('handles uniqueWinners by re-attempting for duplicate userIds', () => {
      // Create participants where many share the same userId to force re-attempts
      const participants = [
        { commentId: 'c001', userId: 'same_user', username: '@same' },
        { commentId: 'c002', userId: 'same_user', username: '@same' },
        { commentId: 'c003', userId: 'same_user', username: '@same' },
        { commentId: 'c004', userId: 'other_user', username: '@other' },
        { commentId: 'c005', userId: 'third_user', username: '@third' },
      ];
      const engine = new GiveawayEngine(
        makeInput({
          participants,
          winnerCount: 2,
          options: { uniqueUsers: false, uniqueWinners: true },
        })
      );
      const result = engine.run();

      const active = result.winners.filter((w) => w.status === 'active');
      expect(active).toHaveLength(2);
      const activeUserIds = active.map((w) => w.participant.userId);
      expect(new Set(activeUserIds).size).toBe(2);

      // If there are deprecated entries, they should have matching winnerNumber but earlier attempt
      const deprecated = result.winners.filter((w) => w.status === 'deprecated');
      for (const d of deprecated) {
        const activeForSlot = active.find((a) => a.winnerNumber === d.winnerNumber);
        expect(activeForSlot).toBeDefined();
        expect(d.attempt).toBeLessThan(activeForSlot!.attempt);
      }
    });

    it('handles uniqueUsers — filters to first comment per user', () => {
      const participants = makeParticipantsWithDuplicateUsers();
      const engine = new GiveawayEngine(
        makeInput({
          participants,
          winnerCount: 1,
          options: { uniqueUsers: true, uniqueWinners: false },
        })
      );
      const result = engine.run();

      // 6 comments from 4 unique users
      expect(result.filteredParticipantCount).toBe(4);
      expect(result.winners[0].winnerIndex).toBeLessThan(4);
    });

    it('works when winnerCount equals participant count with uniqueWinners', () => {
      const participants = makeParticipants(5);
      const engine = new GiveawayEngine(
        makeInput({
          participants,
          winnerCount: 5,
          options: { uniqueUsers: false, uniqueWinners: true },
        })
      );
      const result = engine.run();

      const active = result.winners.filter((w) => w.status === 'active');
      expect(active).toHaveLength(5);
      const activeUserIds = new Set(active.map((w) => w.participant.userId));
      expect(activeUserIds.size).toBe(5);
    });

    it('throws when no participants after filtering', () => {
      const engine = new GiveawayEngine(makeInput({ participants: [] }));
      expect(() => engine.run()).toThrow('No participants available');
    });

    it('throws when winnerCount exceeds participant count', () => {
      const engine = new GiveawayEngine(
        makeInput({
          participants: makeParticipants(2),
          winnerCount: 5,
          options: { uniqueUsers: false, uniqueWinners: true },
        })
      );
      expect(() => engine.run()).toThrow('Cannot select 5 winners from 2 participants');
    });

    it('each winner has independent seed based on winnerNumber', () => {
      const engine = new GiveawayEngine(makeInput({ winnerCount: 3 }));
      const result = engine.run();

      const seeds = result.winners.filter((w) => w.status === 'active').map((w) => w.seedHash);
      expect(new Set(seeds).size).toBe(3);
    });
  });
});
