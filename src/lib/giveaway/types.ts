// --- Input types (passed to GiveawayEngine) ---

export interface GiveawayParticipant {
  commentId: string;
  userId: string;
  username: string;
}

export interface GiveawayInput {
  postId: string;
  postDateIso: string;
  commentCount: number;
  giveawayDateIso: string;
  participants: GiveawayParticipant[];
  winnerCount: number;
  options: { uniqueUsers: boolean; uniqueWinners: boolean };
}

// --- Output types (returned from GiveawayEngine) ---

export type GiveawayWinnerStatus = 'active' | 'deprecated';

export interface GiveawayWinner {
  winnerNumber: number;
  attempt: number;
  status: GiveawayWinnerStatus;
  seedInput: string;
  seedHash: string;
  winnerIndex: number;
  participant: GiveawayParticipant;
}

export interface GiveawayResult {
  participantsHash: string;
  filteredParticipantCount: number;
  winners: GiveawayWinner[];
}

// --- Storage types (Redis) ---

export interface GiveawayRecord {
  giveawayId: string;
  createdAt: string;
  exportId: string;
  profileId: string;
  post: {
    mediaId: string;
    postDateIso: string;
    permalink?: string;
    caption?: string;
  };
  commentCount: number;
  participantsHash: string;
  filteredParticipantCount: number;
  options: { uniqueUsers: boolean; uniqueWinners: boolean; winnerCount: number };
  winners: GiveawayWinner[];
}

export interface GiveawayListItem {
  giveawayId: string;
  createdAt: string;
  post: { mediaId: string; permalink?: string };
  options: { winnerCount: number };
  activeWinnerCount: number;
}
