export type ExportStatus = 'pending' | 'running' | 'csv_pending' | 'done' | 'failed';

export interface NormalizedComment {
  commentId: string;
  userId: string;
  username: string;
  timestamp: string;
  likeCount: number;
  parentCommentId: string | null;
  text: string;
}

export interface ExportRecord {
  exportId: string;
  createdAt: string;
  startedAt: string | null;
  finishedAt: string | null;
  status: ExportStatus;
  owner: { instagramId: string; username: string };
  post: { mediaId: string; permalink?: string; caption?: string; commentsCountAtStart?: number };
  igPaging: { afterCursor: string | null };
  counters: {
    appended: number;
    failed: number;
    skipped: { duplicates: number };
    uniqUsers: number;
  };
  list: { key: string; length: number };
  file: { key: string; size: number; urlExpiresAt?: string; mime: 'text/csv' } | null;
  error: { code: string; message: string } | null;
}

export interface ExportListItem {
  exportId: string;
  createdAt: string;
  status: ExportStatus;
  counters: { appended: number };
}
