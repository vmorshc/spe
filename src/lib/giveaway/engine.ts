import { createCipheriv, createHash } from 'node:crypto';
import type { GiveawayInput, GiveawayParticipant, GiveawayResult, GiveawayWinner } from './types';

const MAX_ATTEMPTS_PER_SLOT = 100;

export class GiveawayEngine {
  private readonly input: GiveawayInput;
  private cachedFiltered: GiveawayParticipant[] | null = null;
  private cachedHash: string | null = null;

  constructor(input: GiveawayInput) {
    this.input = input;
  }

  getFilteredParticipants(): GiveawayParticipant[] {
    if (this.cachedFiltered) return this.cachedFiltered;

    let participants = [...this.input.participants];

    if (this.input.options.uniqueUsers) {
      const seen = new Map<string, GiveawayParticipant>();
      for (const p of participants) {
        const existing = seen.get(p.userId);
        if (!existing || p.commentId < existing.commentId) {
          seen.set(p.userId, p);
        }
      }
      participants = Array.from(seen.values());
    }

    participants.sort((a, b) => a.commentId.localeCompare(b.commentId));
    this.cachedFiltered = participants;
    return participants;
  }

  buildParticipantsHash(): string {
    if (this.cachedHash) return this.cachedHash;
    const filtered = this.getFilteredParticipants();
    const canonical = filtered.map((p) => p.commentId).join('\n');
    this.cachedHash = createHash('sha256').update(canonical).digest('hex');
    return this.cachedHash;
  }

  buildSeedInput(winnerNumber: number, attempt: number): string {
    const hash = this.buildParticipantsHash();
    return [
      this.input.postId,
      this.input.postDateIso,
      this.input.commentCount,
      this.input.giveawayDateIso,
      hash,
      winnerNumber,
      attempt,
    ].join('|');
  }

  buildSeedHash(seedInput: string): string {
    return createHash('sha256').update(seedInput).digest('hex');
  }

  selectWinnerIndex(seedHash: string, participantCount: number): number {
    const key = Buffer.from(seedHash, 'hex');
    const iv = Buffer.alloc(16, 0);
    const cipher = createCipheriv('chacha20', key, iv);
    const keystream = cipher.update(Buffer.alloc(8));
    const uint64 = keystream.readBigUInt64BE(0);
    return Number(uint64 % BigInt(participantCount));
  }

  run(): GiveawayResult {
    const filtered = this.getFilteredParticipants();
    const participantsHash = this.buildParticipantsHash();

    if (filtered.length === 0) {
      throw new Error('No participants available after filtering');
    }

    if (this.input.winnerCount > filtered.length) {
      throw new Error(
        `Cannot select ${this.input.winnerCount} winners from ${filtered.length} participants`
      );
    }

    const winners: GiveawayWinner[] = [];
    const selectedUserIds = new Set<string>();

    for (let slot = 1; slot <= this.input.winnerCount; slot++) {
      let attempt = 1;
      let found = false;

      while (!found && attempt <= MAX_ATTEMPTS_PER_SLOT) {
        const seedInput = this.buildSeedInput(slot, attempt);
        const seedHash = this.buildSeedHash(seedInput);
        const winnerIndex = this.selectWinnerIndex(seedHash, filtered.length);
        const participant = filtered[winnerIndex];

        const isDuplicate =
          this.input.options.uniqueWinners && selectedUserIds.has(participant.userId);

        winners.push({
          winnerNumber: slot,
          attempt,
          status: isDuplicate ? 'deprecated' : 'active',
          seedInput,
          seedHash,
          winnerIndex,
          participant,
        });

        if (!isDuplicate) {
          selectedUserIds.add(participant.userId);
          found = true;
        }

        attempt++;
      }

      if (!found) {
        throw new Error(
          `Could not find unique winner for slot ${slot} after ${MAX_ATTEMPTS_PER_SLOT} attempts`
        );
      }
    }

    return {
      participantsHash,
      filteredParticipantCount: filtered.length,
      winners,
    };
  }
}
