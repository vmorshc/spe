import type { GiveawayInput, GiveawayParticipant } from '../types';

export function makeParticipant(index: number, userId?: string): GiveawayParticipant {
  return {
    commentId: `comment_${String(index).padStart(4, '0')}`,
    userId: userId ?? `user_${index}`,
    username: userId ? `@${userId}` : `@user_${index}`,
  };
}

export function makeParticipants(count: number): GiveawayParticipant[] {
  return Array.from({ length: count }, (_, i) => makeParticipant(i + 1));
}

export function makeParticipantsWithDuplicateUsers(): GiveawayParticipant[] {
  return [
    { commentId: 'comment_0001', userId: 'alice', username: '@alice' },
    { commentId: 'comment_0002', userId: 'bob', username: '@bob' },
    { commentId: 'comment_0003', userId: 'alice', username: '@alice' },
    { commentId: 'comment_0004', userId: 'charlie', username: '@charlie' },
    { commentId: 'comment_0005', userId: 'bob', username: '@bob' },
    { commentId: 'comment_0006', userId: 'dave', username: '@dave' },
  ];
}

const BASE_INPUT = {
  postId: 'post_123',
  postDateIso: '2025-02-01T12:00:00.000Z',
  commentCount: 100,
  giveawayDateIso: '2025-02-15T18:00:00.000Z',
} as const;

export function makeInput(overrides?: Partial<GiveawayInput>): GiveawayInput {
  return {
    ...BASE_INPUT,
    participants: makeParticipants(10),
    winnerCount: 1,
    options: { uniqueUsers: false, uniqueWinners: false },
    ...overrides,
  };
}
