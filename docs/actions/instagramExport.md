# Instagram Export Actions

Source: `src/lib/actions/instagramExport.ts`

Purpose: Start and resume comment export jobs, and read export status and data from Redis.

## Methods

### `startExportAction(mediaId)`
Takes: `mediaId: string`.
Returns: `Promise<{ exportId: string }>`.
How it works: creates a new export record in Redis, initializes counters and list keys, and indexes it by media and user.

### `getExportAction(exportId)`
Takes: `exportId: string`.
Returns: `Promise<ExportRecord>`.
How it works: verifies ownership, updates `list.length` from Redis list length, and returns the record.

### `listExportsByMediaAction(mediaId, offset?, limit?)`
Takes: `mediaId: string`, `offset: number = 0`, `limit: number = 10`.
Returns: `Promise<ExportListItem[]>`.
How it works: reads the export index for a media post and returns recent exports.

### `fetchExportCommentsAction(exportId, offset?, limit?)`
Takes: `exportId: string`, `offset: number = 0`, `limit: number = 50`.
Returns: `Promise<{ items: NormalizedComment[]; nextOffset?: number }>`.
How it works: verifies ownership and reads a slice of normalized comments from Redis list.

### `resumeExportAction(exportId, budgetMs?)`
Takes: `exportId: string`, `budgetMs: number = 1500`.
Returns: `Promise<ExportRecord>`.
How it works: pages through Facebook comments until time budget or hard cap, normalizes and appends comments (deduped by comment ID), updates record status, then marks `csv_pending` and immediately `done` for MVP.
